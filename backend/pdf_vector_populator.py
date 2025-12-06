import os
import logging
import uuid
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
import fitz  # PyMuPDF for PDF Parsing

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("PDFVectorPopulator")

# Initialize SentenceTransformer model
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")  # Multilingual embedding model

# Define the updated EmbeddingFunction to match ChromaDB's required interface
class EmbeddingFunction:
    def __init__(self, model):
        self.model = model

    def __call__(self, input):
        """Generate embeddings for the given input (list of text strings)."""
        if not isinstance(input, list):
            raise ValueError("Expected `input` to be a list of text strings.")
        return self.model.encode(input, show_progress_bar=True)

    def name(self):
        """The name of the embedding function."""
        return "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Initialize persistent ChromaDB client
persist_directory = "./database"  # Directory for persistent storage
chroma_client = PersistentClient(path=persist_directory)

# Create or load the collection with the embedding function
embedding_fn = EmbeddingFunction(model)
collection = chroma_client.get_or_create_collection(
    name="rag-knowledge-base", embedding_function=embedding_fn
)

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    text = ""
    try:
        logger.info(f" Reading PDF: {pdf_path}")
        document = fitz.open(pdf_path)
        for page_num, page in enumerate(document):
            text += page.get_text()  # Extract text from each page
            logger.info(f" Extracted text from Page {page_num + 1}")
        logger.info(f" Total text extracted: {len(text)} characters from {pdf_path}")
    except Exception as e:
        logger.error(f" Error reading PDF file '{pdf_path}': {e}")
    return text

def populate_vector_store(pdf_folder: str):
    """Populate the ChromaDB vector collection with PDFs."""
    logger.info(f" Loading PDFs from folder: {pdf_folder}")
    for file_name in os.listdir(pdf_folder):
        if file_name.endswith(".pdf"):
            pdf_path = os.path.join(pdf_folder, file_name)
            logger.info(f" Processing file: {file_name}")

            # Extract the content of the PDF file
            text = extract_text_from_pdf(pdf_path)

            # Generate unique IDs and add extracted text to the collection
            if text.strip():
                unique_id = str(uuid.uuid4())  # Generate a unique document ID
                collection.add(
                    ids=[unique_id],    # Add the unique ID
                    documents=[text],   # Extracted content
                    metadatas=[{"source": file_name}]  # Metadata about source
                )
                logger.info(f" Successfully added '{file_name}' to the vector store (ID: {unique_id}).")
            else:
                logger.warning(f"⚠️ Could not extract content from '{file_name}'.")
        else:
            logger.info(f" Skipped non-PDF file: {file_name}")

if __name__ == "__main__":
    # Folder containing PDF files for processing
    pdf_folder_path = "./data"  # Place your documents here

    # Execute the populate function
    populate_vector_store(pdf_folder_path)