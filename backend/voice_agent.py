"""
HIV Knowledge Assistant
Features:
- Knowledge base created from HIV guideline PDFs (via ChromaDB)
- Queries answered using context retrieval + Nebius LLM (RAG)
- Speech-to-Text (Deepgram) and Text-to-Speech (ElevenLabs or other TTS)
"""

import os
import logging
import requests
from pathlib import Path
from dotenv import load_dotenv
from chromadb import PersistentClient
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import deepgram, elevenlabs, silero, openai

# Load environment variables from `.env` file
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path, override=True)

# Verify environment variables
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

if not all([NEBIUS_API_KEY, DEEPGRAM_API_KEY, ELEVEN_API_KEY]):
    raise ValueError("Missing one or more required API keys. Check your .env file.")

# Persistent ChromaDB configuration
PERSIST_DIRECTORY = "./database"
chroma_client = PersistentClient(path=PERSIST_DIRECTORY)
collection = chroma_client.get_or_create_collection(name="hiv-knowledge-base")

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("HIVKnowledgeAssistant")

# Minimal prewarm model setup
def prewarm(job_process):
    logger.info("Prewarming models (VAD)...")
    job_process.userdata["vad"] = silero.VAD.load(
        min_speech_duration=0.3,
        min_silence_duration=0.6,
        padding_duration=0.2,
        activation_threshold=0.5,
    )
    logger.info("VAD ready for use.")

class HIVAssistant(Agent):
    """HIV Knowledge Assistant with ChromaDB and Nebius LLM."""
    def __init__(self, llm_model):
        super().__init__(instructions="""
        You are an intelligent HIV guideline assistant dedicated to providing precise, clear, and concise information based on the uploaded HIV guideline documents and recommendations.

**Your Capabilities**:
- You answer user queries about HIV prevention, diagnosis, and treatment by extracting information from the database of guidelines.
- Your responses are conversational, professional, and easy to understand. Keep answers succinct and free of unnecessary complexity.
- You rely strictly on the provided context to formulate answers. If no context is available to address the query, inform the user politely that the knowledge base does not include relevant information.
- You understand and respond in the user’s language. If a query is in a different language, reply in that language to maintain ease of communication.

**Response Guidelines**:
1. Focus on giving **practical, concise, and actionable information**.
2. Avoid lengthy explanations unless absolutely necessary. Aim for 1–2 short sentences.
3. Maintain a **warm and supportive tone**, suitable for sensitive health-related topics.
4. Clearly acknowledge when the knowledge base lacks information.

**Examples**:
- User: "What are the latest HIV prevention guidelines?"
  Assistant: "The latest guidelines recommend pre-exposure prophylaxis (PrEP) for high-risk groups. Let me know if you'd like more details!"
  
- User: "What treatments are available for managing HIV?"  
  Assistant: "Antiretroviral therapy (ART) is the standard treatment for managing HIV. It helps maintain viral suppression and immune health."

- User: "Welche vorbeugenden Maßnahmen gibt es bei HIV?"  
  Assistant: "Die Leitlinien empfehlen Präexpositionsprophylaxe (PrEP) und regelmäßige HIV-Tests für Risikogruppen."
  
- User: "Can HIV be cured?"  
  Assistant: "Currently, there is no cure for HIV, but treatments like ART can achieve long-term viral suppression."

- User: "Tell me about HIV diagnosis."  
  Assistant: "HIV diagnosis involves antibody/antigen testing with confirmatory testing if needed."
        """)
        self.llm_model = llm_model

    def fetch_context_from_chromadb(self, query):
        """Retrieve context from ChromaDB."""
        try:
            results = collection.query(query_texts=[query], n_results=3)
            if not results["documents"]:
                logger.warning(f"No matches for query: '{query}'")
                return None
            context = "\n\n".join([f"(Doc {i+1}) {result}" for i, result in enumerate(results["documents"])])
            logger.info(f"Retrieved context: {context}")
            return context
        except Exception as e:
            logger.error(f"Error querying ChromaDB: {e}")
            return None

    async def on_user_text(self, msg):
        """Process user queries."""
        user_query = msg.content.strip()
        logger.info(f"User Query: '{user_query}'")

        try:
            # Step 1: Fetch context from ChromaDB
            context = self.fetch_context_from_chromadb(user_query)
            if not context:
                fallback_response = "I'm sorry, I couldn't find relevant information."
                await self.reply(fallback_response)
                logger.info("Fallback response sent: No data found in the knowledge base.")
                return

            # Step 2: Generate response using Nebius LLM
            response = await self._generate_llm_response(context, user_query)
            await self.reply(response)
        except Exception as e:
            logger.error(f"Error handling query: {e}")
            await self.reply("An internal error occurred. Please try again.")

    async def _generate_llm_response(self, context, query):
        """Generate a response from Nebius LLM using provided context."""
        try:
            logger.info("Generating response via Nebius API...")
            prompt = f"CONTEXT: {context}\n\nQUERY: {query}"
            return await self.llm_model.completion(prompt=prompt, max_tokens=300)
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Sorry, I couldn't process your query at this time."

async def entrypoint(ctx: JobContext):
    """Main entrypoint: Initiate and configure the assistant."""
    logger.info("HIV Knowledge Assistant Starting 🚀")

    # Nebius LLM configuration
    llm_model = openai.LLM(
        base_url="https://api.tokenfactory.nebius.com/v1/",
        api_key=NEBIUS_API_KEY,
        model="meta-llama/Llama-3.3-70B-Instruct",
        temperature=0.7,
    )

    # Configure and start the session
    session = AgentSession(
        stt=deepgram.STT(api_key=DEEPGRAM_API_KEY, model="nova-2-general"),  # Deepgram STT
        tts=elevenlabs.TTS(api_key=ELEVEN_API_KEY, model="eleven_turbo_v2_5", voice_id="21m00Tcm4TlvDq8ikWAM"),  # ElevenLabs TTS
        llm=llm_model,  # Nebius LLM for response generation
        vad=silero.VAD.load(
            min_speech_duration=0.3,
            min_silence_duration=0.6,
            padding_duration=0.2,
            activation_threshold=0.5,
        )
    )

    # Start the voice assistant
    assistant = HIVAssistant(llm_model=llm_model)
    await session.start(room=ctx.room, agent=assistant)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))