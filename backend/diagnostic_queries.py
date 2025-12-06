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
        query_text = kwargs.get('input') or kwargs.get('text') or kwargs.get('query')
        if query_text is None:
            raise ValueError(f"No query text provided. Received kwargs: {kwargs}")
        if isinstance(query_text, list):
            query_text = query_text[0] if query_text else ""
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

def test_munich_clinic_queries():
    """Test queries specifically about Munich HIV clinics."""
    
    print("=" * 80)
    print("DIAGNOSTIC TEST: Munich HIV Clinic Information")
    print("=" * 80)
    
    # Test queries that should find the TUM clinic
    test_queries = [
        "TUM HIV Zentrum München",
        "HIV Klinik München IZAR",
        "Wo kann ich in München HIV Beratung bekommen",
        "München HIV Test Zentrum",
        "HIV clinic at TUM hospital Munich",
        "Interdisziplinäres HIV Zentrum",
        "mri.tum.de HIV"
    ]
    
    for query in test_queries:
        print(f"\n Query: '{query}'")
        print("-" * 80)
        
        try:
            # Request MORE results to see if the clinic info is buried
            results = collection.query(query_texts=[query], n_results=10)
            
            if results["documents"] and results["documents"][0]:
                print(f"Found {len(results['documents'][0])} results\n")
                
                # Check each result
                for i, (doc, metadata, distance) in enumerate(zip(
                    results["documents"][0], 
                    results["metadatas"][0],
                    results["distances"][0] if "distances" in results else [0]*len(results["documents"][0])
                )):
                    source_type = metadata.get("source_type", "unknown")
                    title = metadata.get("title", "Unknown")
                    source = metadata.get("source", "Unknown")
                    
                    # Highlight if it's from TUM/Munich clinic
                    is_tum = "tum" in source.lower() or "izar" in title.lower() or "checkpoint" in title.lower()
                    marker = " CLINIC INFO " if is_tum else ""
                    
                    print(f"Result {i+1}: [{source_type.upper()}] {title} {marker}")
                    print(f"   Source: {source}")
                    print(f"   Distance: {distance:.4f}")
                    
                    # Show content preview
                    preview = doc[:300].replace('\n', ' ').strip()
                    print(f"   Content: {preview}...")
                    print()
            else:
                print(" No results found")
                
        except Exception as e:
            print(f" Error: {e}")
        
        print("-" * 80)
    
    # Now check what TUM clinic content we actually have
    print("\n" + "=" * 80)
    print("CHECKING ALL TUM/MUNICH CLINIC CONTENT IN DATABASE")
    print("=" * 80)
    
    try:
        # Get ALL documents and filter for Munich clinics
        all_results = collection.get()
        
        munich_docs = []
        for i, (doc_id, metadata) in enumerate(zip(all_results["ids"], all_results["metadatas"])):
            source = metadata.get("source", "").lower()
            title = metadata.get("title", "").lower()
            
            # Check if it's Munich clinic related
            if any(keyword in source or keyword in title for keyword in 
                   ["tum", "izar", "checkpoint", "münchen", "munich", "mri.tum"]):
                munich_docs.append({
                    "id": doc_id,
                    "title": metadata.get("title", "Unknown"),
                    "source": metadata.get("source", "Unknown"),
                    "source_type": metadata.get("source_type", "unknown"),
                    "chunk_index": metadata.get("chunk_index", 0),
                    "total_chunks": metadata.get("total_chunks", 1)
                })
        
        if munich_docs:
            print(f"\n Found {len(munich_docs)} Munich clinic documents/chunks:\n")
            for doc in munich_docs:
                chunk_info = f"(chunk {doc['chunk_index'] + 1}/{doc['total_chunks']})" if doc['total_chunks'] > 1 else ""
                print(f"  • [{doc['source_type'].upper()}] {doc['title']} {chunk_info}")
                print(f"    Source: {doc['source']}")
                print()
        else:
            print("\n NO Munich clinic documents found in the database!")
            print("This explains why your voice agent can't find the information.")
            
    except Exception as e:
        print(f" Error checking database: {e}")

if __name__ == "__main__":
    test_munich_clinic_queries()