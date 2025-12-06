"""
HIV Knowledge Assistant - Using AgentSession API
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.plugins import deepgram, elevenlabs, silero, openai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("HIVAssistant")

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path, override=True)

# Get API keys
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

if not all([NEBIUS_API_KEY, DEEPGRAM_API_KEY, ELEVEN_API_KEY]):
    raise ValueError("Missing required API keys in .env file")

# Global variables - will be initialized lazily
_collection = None
_model = None

def get_collection():
    """Lazy load ChromaDB collection."""
    global _collection, _model
    
    if _collection is not None:
        return _collection
    
    logger.info("Initializing ChromaDB and SentenceTransformer...")
    
    from chromadb import PersistentClient
    from sentence_transformers import SentenceTransformer
    
    # Load model
    _model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    
    # Embedding function
    class EmbeddingFunction:
        def __init__(self, model):
            self.model = model

        def __call__(self, input):
            if not isinstance(input, list):
                raise ValueError("Expected input to be a list")
            return self.model.encode(input, show_progress_bar=False).tolist()
        
        def embed_documents(self, texts):
            return self.model.encode(texts, show_progress_bar=False).tolist()
        
        def embed_query(self, **kwargs):
            query_text = kwargs.get('input') or kwargs.get('text') or kwargs.get('query')
            if query_text is None:
                raise ValueError("No query text provided")
            if isinstance(query_text, list):
                query_text = query_text[0] if query_text else ""
            embedding = self.model.encode([str(query_text)], show_progress_bar=False)
            return embedding.tolist()

        def name(self):
            return "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    
    # Initialize ChromaDB
    PERSIST_DIRECTORY = "./hybrid_database"
    chroma_client = PersistentClient(path=PERSIST_DIRECTORY)
    embedding_fn = EmbeddingFunction(_model)
    _collection = chroma_client.get_or_create_collection(
        name="hybrid-rag-knowledge-base",
        embedding_function=embedding_fn
    )
    
    logger.info(f"ChromaDB ready with {_collection.count()} documents")
    return _collection

def generate_sub_queries(query: str) -> list:
    """Generate multiple queries for better retrieval."""
    queries = [query]
    query_lower = query.lower()
    
    if any(w in query_lower for w in ['münchen', 'munich', 'wo kann', 'tum', 'izar', 'checkpoint']):
        queries.extend([
            "HIV Zentrum München",
            "TUM HIV Klinik IZAR",
            "Checkpoint München"
        ])
    
    if any(w in query_lower for w in ['termin', 'appointment', 'kontakt', 'contact', 'telefon', 'phone']):
        queries.extend([
            "HIV Klinik Kontakt",
            "IZAR Telefon Sprechstunden"
        ])
    
    return list(set(queries))

def retrieve_context(query: str, n_results: int = 8) -> str:
    """Retrieve context from ChromaDB."""
    collection = get_collection()
    
    sub_queries = generate_sub_queries(query)
    logger.info(f"Searching with {len(sub_queries)} queries")
    
    all_docs = []
    all_metadatas = []
    seen_ids = set()
    
    for sub_query in sub_queries:
        try:
            results = collection.query(query_texts=[sub_query], n_results=n_results)
            
            if results["documents"] and results["documents"][0]:
                for doc, metadata in zip(results["documents"][0], results["metadatas"][0]):
                    doc_id = f"{metadata.get('source', '')}_{metadata.get('chunk_index', 0)}"
                    
                    if doc_id not in seen_ids:
                        seen_ids.add(doc_id)
                        all_docs.append(doc)
                        all_metadatas.append(metadata)
        except Exception as e:
            logger.error(f"Query error: {e}")
    
    if not all_docs:
        return None
    
    # Format context
    context_parts = []
    for i, (doc, meta) in enumerate(list(zip(all_docs, all_metadatas))[:8]):
        title = meta.get('title', 'Unknown')
        source_type = meta.get('source_type', 'unknown').upper()
        context_parts.append(f"[{source_type}: {title}]\n{doc}")
    
    logger.info(f"Retrieved {len(context_parts)} results")
    return "\n\n".join(context_parts)

class HIVAssistant(Agent):
    """HIV Knowledge Assistant using AgentSession."""
    
    def __init__(self):
        super().__init__(
            instructions="""You are an intelligent HIV knowledge assistant for Munich, Germany.

Your role:
- Answer questions about HIV prevention, diagnosis, treatment, and testing
- Provide information about HIV clinics and services in Munich
- Give clear, concise, and compassionate responses
- Respond in the user's language (German or English)

Response guidelines:
- Keep answers brief (2-3 sentences) unless more detail is requested
- Include specific details like addresses and phone numbers when available in the context
- If you don't have information, say so politely
- Maintain a warm, supportive tone

When you receive context from the knowledge base, use it to provide accurate, specific information."""
        )
    
    async def on_user_text(self, msg):
        """Handle user text messages with RAG."""
        user_query = msg.content.strip()
        logger.info(f"💬 User query: '{user_query}'")
        
        try:
            # Retrieve context from knowledge base
            context = retrieve_context(user_query, n_results=8)
            
            if context:
                logger.info("✅ Context retrieved from knowledge base")
                # Create enhanced prompt with context
                enhanced_prompt = f"""CONTEXT from HIV knowledge base:

{context}

USER QUESTION: {user_query}

Please answer the user's question using the context above. Include specific details like addresses, phone numbers, and opening hours if they are mentioned in the context. Respond in the same language as the user's question."""
                
                # Reply using the LLM with context
                await self.reply(enhanced_prompt)
            else:
                logger.warning("⚠️ No context found")
                await self.reply(f"USER QUESTION: {user_query}\n\nI couldn't find specific information about this in my knowledge base. I'll provide a general response if possible.")
                
        except Exception as e:
            logger.error(f"Error handling query: {e}")
            await self.reply("I encountered an error processing your question. Please try again.")

def prewarm(proc: JobContext):
    """Prewarm function - minimal setup."""
    logger.info("Prewarming VAD...")
    proc.userdata["vad"] = silero.VAD.load()
    logger.info("VAD ready")

async def entrypoint(ctx: JobContext):
    """Main entrypoint using AgentSession."""
    
    logger.info("🚀 Starting HIV Knowledge Assistant...")
    
    # Configure Nebius LLM
    nebius_llm = openai.LLM(
        base_url="https://api.tokenfactory.nebius.com/v1/",
        api_key=NEBIUS_API_KEY,
        model="meta-llama/Llama-3.3-70B-Instruct",
        temperature=0.7,
    )
    
    # Create AgentSession
    session = AgentSession(
        stt=deepgram.STT(api_key=DEEPGRAM_API_KEY, model="nova-2-general"),
        tts=elevenlabs.TTS(
            api_key=ELEVEN_API_KEY,
            model="eleven_turbo_v2_5",
            voice_id="21m00Tcm4TlvDq8ikWAM"
        ),
        llm=nebius_llm,
        vad=ctx.proc.userdata["vad"],
    )
    
    # Create assistant instance
    assistant = HIVAssistant()
    
    # Start the session
    await session.start(room=ctx.room, agent=assistant)
    
    logger.info("✅ Assistant started successfully!")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        )
    )