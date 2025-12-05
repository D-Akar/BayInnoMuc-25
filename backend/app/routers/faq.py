"""
FAQ API routes
TODO: Add rate limiting
TODO: Implement vector database similarity search
TODO: Add result ranking and relevance scoring
TODO: Cache common search queries
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any

from app.services import faq_service

router = APIRouter()


@router.get("/search")
async def search_faqs(q: str = Query("", description="Search query")):
    """Search FAQs by query string"""
    try:
        results = faq_service.search_faqs(q)
        return {"results": results}
    except Exception as e:
        print(f"Error searching FAQs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

