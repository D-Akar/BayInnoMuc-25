import os
import logging
import uuid
import asyncio
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
import fitz  # PyMuPDF for PDF Parsing
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from urllib.parse import urlparse
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EnhancedVectorPopulator")

# Initialize SentenceTransformer model
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

# Initialize persistent ChromaDB client
persist_directory = "./hybrid_database"
chroma_client = PersistentClient(path=persist_directory)

# Create or load the collection with the embedding function
embedding_fn = EmbeddingFunction(model)
collection = chroma_client.get_or_create_collection(
    name="hybrid-rag-knowledge-base", embedding_function=embedding_fn
)

def clean_markdown_content(content: str) -> str:
    """Clean markdown content to remove navigation, headers, and boilerplate."""
    # Remove markdown links at the start (navigation)
    content = re.sub(r'^\[.*?\]\(.*?\)\s*', '', content, flags=re.MULTILINE)
    
    # Remove image markdown
    content = re.sub(r'!\[.*?\]\(.*?\)', '', content)
    
    # Remove multiple newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    # Remove common navigation phrases
    nav_phrases = [
        'Direkt zum Inhalt',
        'Zum Inhalt springen',
        'Skip to content',
        'Main navigation',
        'Hauptnavigation'
    ]
    for phrase in nav_phrases:
        content = content.replace(phrase, '')
    
    return content.strip()

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """
    Split text into overlapping chunks for better retrieval.
    
    Args:
        text: The text to chunk
        chunk_size: Maximum characters per chunk
        overlap: Number of characters to overlap between chunks
    """
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # Try to break at a sentence or paragraph boundary
        if end < len(text):
            # Look for paragraph break first
            paragraph_break = text.rfind('\n\n', start, end)
            if paragraph_break > start + chunk_size // 2:
                end = paragraph_break
            else:
                # Look for sentence break
                sentence_break = max(
                    text.rfind('. ', start, end),
                    text.rfind('! ', start, end),
                    text.rfind('? ', start, end)
                )
                if sentence_break > start + chunk_size // 2:
                    end = sentence_break + 1
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap if end < len(text) else len(text)
    
    return chunks

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    text = ""
    try:
        logger.info(f"Reading PDF: {pdf_path}")
        document = fitz.open(pdf_path)
        for page_num, page in enumerate(document):
            text += page.get_text()
            logger.info(f"Extracted text from Page {page_num + 1}")
        logger.info(f"Total text extracted: {len(text)} characters from {pdf_path}")
    except Exception as e:
        logger.error(f"Error reading PDF file '{pdf_path}': {e}")
    return text

async def crawl_urls_batch(urls: list[str]) -> list[dict]:
    """Crawl multiple URLs using the modern Crawl4AI API."""
    logger.info(f"Starting to crawl {len(urls)} URLs...")
    
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        stream=False,
        verbose=True
    )
    
    crawled_data = []
    
    try:
        async with AsyncWebCrawler() as crawler:
            logger.info("Crawler initialized, starting batch crawl...")
            results = await crawler.arun_many(urls, config=run_config)
            
            for result in results:
                if result.success:
                    title = result.url.split('/')[-1] if result.url else "Unknown"
                    if hasattr(result, 'metadata') and result.metadata:
                        title = result.metadata.get('title', title)
                    
                    content = ""
                    if hasattr(result, 'markdown') and result.markdown:
                        content = result.markdown.raw_markdown if hasattr(result.markdown, 'raw_markdown') else str(result.markdown)
                    elif hasattr(result, 'cleaned_html'):
                        content = result.cleaned_html
                    
                    # Clean the content
                    content = clean_markdown_content(content)
                    
                    if content.strip() and len(content) > 200:  # Minimum content length
                        crawled_data.append({
                            'url': result.url,
                            'title': title,
                            'content': content,
                            'content_length': len(content)
                        })
                        logger.info(f"Successfully crawled: {title} ({len(content)} chars)")
                    else:
                        logger.warning(f"Content too short or empty from: {result.url}")
                else:
                    logger.error(f"Failed to crawl {result.url}: {result.error_message}")
                    
    except Exception as e:
        logger.error(f"Error during batch crawling: {e}")
    
    return crawled_data

def populate_pdfs(pdf_folder: str):
    """Populate the ChromaDB vector collection with PDFs."""
    logger.info(f"Loading PDFs from folder: {pdf_folder}")
    
    if not os.path.exists(pdf_folder):
        logger.warning(f"PDF folder '{pdf_folder}' does not exist. Skipping PDF processing.")
        return
    
    pdf_count = 0
    chunk_count = 0
    
    for file_name in os.listdir(pdf_folder):
        if file_name.endswith(".pdf"):
            pdf_path = os.path.join(pdf_folder, file_name)
            logger.info(f"Processing PDF: {file_name}")
            
            text = extract_text_from_pdf(pdf_path)
            
            if text.strip() and len(text) > 200:
                # Chunk the PDF content
                chunks = chunk_text(text, chunk_size=1000, overlap=200)
                logger.info(f"Split PDF into {len(chunks)} chunks")
                
                for i, chunk in enumerate(chunks):
                    unique_id = str(uuid.uuid4())
                    collection.add(
                        ids=[unique_id],
                        documents=[chunk],
                        metadatas=[{
                            "source": file_name,
                            "source_type": "pdf",
                            "title": file_name.replace(".pdf", ""),
                            "chunk_index": i,
                            "total_chunks": len(chunks),
                            "content_length": len(chunk)
                        }]
                    )
                    chunk_count += 1
                
                pdf_count += 1
                logger.info(f"Successfully added PDF '{file_name}' ({len(chunks)} chunks) to vector store.")
            else:
                logger.warning(f"Could not extract sufficient content from PDF '{file_name}'.")
    
    logger.info(f"Total PDFs processed: {pdf_count} ({chunk_count} chunks)")

async def populate_urls(urls: list[str]):
    """Populate the ChromaDB vector collection with URL content using modern Crawl4AI."""
    logger.info(f"Processing {len(urls)} URLs...")
    
    crawled_data = await crawl_urls_batch(urls)
    
    url_count = 0
    chunk_count = 0
    
    for data in crawled_data:
        try:
            # Chunk the content for better retrieval
            chunks = chunk_text(data['content'], chunk_size=1000, overlap=200)
            logger.info(f"Split '{data['title']}' into {len(chunks)} chunks")
            
            for i, chunk in enumerate(chunks):
                unique_id = str(uuid.uuid4())
                collection.add(
                    ids=[unique_id],
                    documents=[chunk],
                    metadatas=[{
                        "source": data['url'],
                        "source_type": "url",
                        "title": data['title'],
                        "chunk_index": i,
                        "total_chunks": len(chunks),
                        "content_length": len(chunk)
                    }]
                )
                chunk_count += 1
            
            url_count += 1
            logger.info(f"Successfully added URL '{data['title']}' ({len(chunks)} chunks) to vector store.")
            
        except Exception as e:
            logger.error(f"Error adding URL {data['url']} to vector store: {e}")
    
    logger.info(f"Total URLs processed: {url_count} ({chunk_count} chunks)")

async def populate_knowledge_base():
    """Main function to populate knowledge base from both PDFs and URLs."""
    logger.info("Starting enhanced knowledge base population...")
    
    pdf_folder_path = "./data"
    
    hiv_urls = [
        "https://eacs.sanfordguide.com/",
        "https://eacs.sanfordguide.com/en/eacs-hiv/art/hiv-2",
        "https://eacs.sanfordguide.com/en/eacs-hiv/art/eacs-pregnancy-and-hiv",
        "https://www.rki.de/SharedDocs/FAQs/DE/HIVAids/FAQ-Liste.html",
        "https://www.aidshilfe.de/de/oft-gestellte-fragen-hiv",
        "https://www.aidshilfe.de/de/faq-hiv-test",
        "https://www.aidshilfe.de/de/faq-prep",
        "https://register.awmf.org/de/leitlinien/detail/013-099",
        "https://register.awmf.org/de/leitlinien/detail/059-006",
        "https://www.mitsicherheitbesser.de/hiv-test-hilfe/hiv-test/",
        "https://www.mitsicherheitbesser.de/hiv-test-hilfe/beratung-und-hilfe/",
        "https://mri.tum.de/de/Kliniken-und-Zentren/unsere-Zentren/HIV-Zentrum-IZAR",
        "https://www.checkpoint-muenchen.de/beratungsstelle-hiv-stis.html",
        "https://www.aidshilfe.de/de/geschlechtskrankheiten-test"
    ]
    
    try:
        initial_count = collection.count()
        logger.info(f"Initial collection size: {initial_count} documents")
        
        populate_pdfs(pdf_folder_path)
        await populate_urls(hiv_urls)
        
        final_count = collection.count()
        new_docs = final_count - initial_count
        
        logger.info("Knowledge base population completed!")
        logger.info(f"Added {new_docs} new document chunks")
        logger.info(f"Total documents in collection: {final_count}")
        
        try:
            sample_results = collection.query(query_texts=["HIV prevention"], n_results=3)
            if sample_results["metadatas"]:
                logger.info("Sample documents in collection:")
                for i, metadata in enumerate(sample_results["metadatas"][0][:3]):
                    source_type = metadata.get("source_type", "unknown")
                    title = metadata.get("title", "Unknown Title")
                    chunk_info = f"(chunk {metadata.get('chunk_index', 0) + 1}/{metadata.get('total_chunks', 1)})"
                    logger.info(f"   {i+1}. [{source_type.upper()}] {title} {chunk_info}")
        except Exception as e:
            logger.warning(f"Could not query sample results: {e}")
        
    except Exception as e:
        logger.error(f"Error during knowledge base population: {e}")

if __name__ == "__main__":
    asyncio.run(populate_knowledge_base())