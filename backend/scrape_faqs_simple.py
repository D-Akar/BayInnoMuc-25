"""
Simple HIV FAQ Scraper with Nebius LLM
Single script - just run it!
"""

import asyncio
import json
import os
from pathlib import Path
from datetime import datetime
from crawl4ai import AsyncWebCrawler
from openai import OpenAI
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY

# Configuration
FAQ_URLS = [
    "https://www.rki.de/SharedDocs/FAQs/DE/HIVAids/FAQ-Liste.html",
    "https://www.aidshilfe.de/de/faq-hiv-test",
    "https://www.aidshilfe.de/de/faq-prep"
]

OUTPUT_DIR = Path("./hiv_faqs")
OUTPUT_DIR.mkdir(exist_ok=True)

# Initialize Nebius client
client = OpenAI(
    base_url="https://api.tokenfactory.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY")
)

async def scrape_page(url: str) -> str:
    """Scrape a page and return markdown content."""
    print(f" Scraping: {url}")
    
    async with AsyncWebCrawler(verbose=False) as crawler:
        result = await crawler.arun(url=url, bypass_cache=True)
        
        if result.success:
            print(f" Scraped successfully")
            return result.markdown
        else:
            print(f" Failed: {result.error_message}")
            return None

def extract_faqs_with_llm(markdown: str, url: str) -> list:
    """Use Nebius LLM to extract Q&A pairs."""
    print(f" Extracting FAQs with LLM...")
    
    prompt = f"""Extract all FAQ question-answer pairs from this German HIV information page.

Return a JSON array of objects with this format:
[
  {{"question": "full question text", "answer": "complete answer"}},
  ...
]

Rules:
- Extract ALL questions and their complete answers
- Keep German text unchanged
- Include all important details in answers
- Return ONLY valid JSON, no extra text

Content:
{markdown[:15000]}"""  # Limit to first 15k chars to avoid token limits

    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-0528",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at extracting structured information from web content. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": [{"type": "text", "text": prompt}]
                }
            ],
            temperature=0.3,
            max_tokens=4000
        )
        
        # Get response text
        content = response.choices[0].message.content
        
        # Clean up response (remove markdown code blocks if present)
        content = content.strip()
        if content.startswith('```json'):
            content = content[7:]
        if content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()
        
        # Parse JSON
        faqs = json.loads(content)
        print(f" Extracted {len(faqs)} Q&A pairs")
        return faqs
        
    except Exception as e:
        print(f"⚠️ LLM extraction failed: {e}")
        print("Falling back to simple parsing...")
        return parse_simple(markdown)

def parse_simple(markdown: str) -> list:
    """Fallback: simple Q&A extraction."""
    faqs = []
    lines = markdown.split('\n')
    
    current_q = None
    current_a = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if line.endswith('?') or (line[0].isdigit() if line else False):
            if current_q and current_a:
                faqs.append({
                    "question": current_q,
                    "answer": ' '.join(current_a)
                })
            current_q = line.lstrip('#*-0123456789.) ')
            current_a = []
        elif current_q:
            current_a.append(line)
    
    if current_q and current_a:
        faqs.append({"question": current_q, "answer": ' '.join(current_a)})
    
    return faqs

def create_pdf(faqs: list, url: str, output_path: Path):
    """Create PDF from FAQ data."""
    print(f" Creating PDF: {output_path.name}")
    
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        textColor='#1e40af'
    )
    story.append(Paragraph("HIV/AIDS FAQ", title_style))
    
    # Metadata
    meta_style = ParagraphStyle('Meta', parent=styles['Normal'], fontSize=9, textColor='#6b7280', spaceAfter=20)
    story.append(Paragraph(f"Quelle: {url}<br/>Datum: {datetime.now().strftime('%Y-%m-%d')}<br/>Anzahl: {len(faqs)} Fragen", meta_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Q&A
    q_style = ParagraphStyle('Q', parent=styles['Heading3'], fontSize=11, spaceBefore=10, spaceAfter=5)
    a_style = ParagraphStyle('A', parent=styles['Normal'], fontSize=10, alignment=TA_JUSTIFY, spaceAfter=10, leftIndent=10)
    
    for i, faq in enumerate(faqs, 1):
        q_text = f"<b>Frage {i}:</b> {clean_text(faq['question'])}"
        story.append(Paragraph(q_text, q_style))
        
        a_text = clean_text(faq['answer'])
        story.append(Paragraph(a_text, a_style))
        story.append(Spacer(1, 0.1*inch))
    
    doc.build(story)
    print(f" PDF saved")

def clean_text(text: str) -> str:
    """Clean text for PDF."""
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

async def process_url(url: str):
    """Process a single URL."""
    print(f"\n{'='*60}")
    print(f"Processing: {url}")
    print('='*60)
    
    # Extract site name for filename
    site_name = url.split('/')[-1].replace('.html', '').replace('-', '_')
    if not site_name:
        site_name = url.split('/')[-2]
    
    # Scrape
    markdown = await scrape_page(url)
    if not markdown:
        return
    
    # Extract FAQs
    faqs = extract_faqs_with_llm(markdown, url)
    if not faqs:
        print("⚠️ No FAQs extracted")
        return
    
    # Save PDF
    pdf_path = OUTPUT_DIR / f"{site_name}.pdf"
    create_pdf(faqs, url, pdf_path)
    
    # Save JSON backup
    json_path = OUTPUT_DIR / f"{site_name}.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({"url": url, "faqs": faqs, "date": datetime.now().isoformat()}, f, ensure_ascii=False, indent=2)
    
    print(f" Completed: {site_name}")

async def main():
    """Main function."""
    print(" HIV FAQ Scraper")
    print(f" Output: {OUTPUT_DIR}\n")
    
    # Check API key
    if not os.environ.get("NEBIUS_API_KEY"):
        print(" Error: NEBIUS_API_KEY not found in environment")
        print("Set it with: export NEBIUS_API_KEY='your-key-here'")
        return
    
    print(" Nebius API key found\n")
    
    # Process each URL
    for url in FAQ_URLS:
        try:
            await process_url(url)
            await asyncio.sleep(2)  # Be nice to servers
        except Exception as e:
            print(f" Error: {e}")
            continue
    
    print(f"\n{'='*60}")
    print(" ALL DONE!")
    print(f" Check {OUTPUT_DIR} for PDFs and JSON files")
    print('='*60)

if __name__ == "__main__":
    asyncio.run(main())