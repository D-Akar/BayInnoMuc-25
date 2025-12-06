import asyncio
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# Same setup as your populator
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

class EmbeddingFunction:
    def __init__(self, model):
        self.model = model

    def __call__(self, input):
        if not isinstance(input, list):
            raise ValueError("Expected `input` to be a list of text strings.")
        return self.model.encode(input, show_progress_bar=True).tolist()
    
    def embed_documents(self, texts):
        return self.model.encode(texts, show_progress_bar=True).tolist()
    
    def embed_query(self, **kwargs):
        """Embed a single query - flexible parameter handling."""
        # Handle different parameter names that ChromaDB might use
        query_text = kwargs.get('input') or kwargs.get('text') or kwargs.get('query')
        
        if query_text is None:
            raise ValueError(f"No query text provided. Received kwargs: {kwargs}")
    
        # Ensure it's a string
        if isinstance(query_text, list):
            query_text = query_text[0] if query_text else ""
        
        # Return as a list (ChromaDB expects a list)
        embedding = self.model.encode([str(query_text)], show_progress_bar=False)
        return embedding.tolist()

    def name(self):
        return "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Connect to your knowledge base
chroma_client = PersistentClient(path="./hybrid_database")
embedding_fn = EmbeddingFunction(model)
collection = chroma_client.get_or_create_collection(
    name="hybrid-rag-knowledge-base", embedding_function=embedding_fn
)

def test_queries():
    """Test various HIV-related queries to see content quality."""
    
    test_questions = [
        "What is PrEP for HIV prevention?",
        "Wo kann ich einen HIV-Test machen?",  # German: Where can I get an HIV test?
        "HIV treatment options",
        "PrEP Nebenwirkungen",  # German: PrEP side effects
        "HIV transmission risk",
        "München HIV Beratung"  # German: Munich HIV counseling
    ]
    
    print("=" * 60)
    print("TESTING YOUR HIV KNOWLEDGE BASE QUALITY")
    print("=" * 60)
    
    for question in test_questions:
        print(f"\n Query: '{question}'")
        print("-" * 40)
        
        try:
            results = collection.query(query_texts=[question], n_results=2)
            
            if results["documents"] and results["documents"][0]:
                for i, (doc, metadata) in enumerate(zip(results["documents"][0], results["metadatas"][0])):
                    source_type = metadata.get("source_type", "unknown")
                    title = metadata.get("title", "Unknown")
                    source = metadata.get("source", "Unknown")
                    
                    print(f" Result {i+1}: [{source_type.upper()}] {title}")
                    print(f"   Source: {source}")
                    
                    # Show first 200 characters to assess quality
                    preview = doc[:200].replace('\n', ' ').strip()
                    print(f"   Content preview: {preview}...")
                    print()
            else:
                print(" No results found")
                
        except Exception as e:
            print(f" Error: {e}")
        
        print("-" * 40)

if __name__ == "__main__":
    test_queries()