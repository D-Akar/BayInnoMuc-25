"""
FastAPI application for HIV Care Assistance backend
TODO: Add authentication, rate limiting, logging, and monitoring
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()

# Verify API key is loaded
if not os.getenv("API_KEY"):
    print("WARNING: API_KEY is not set!")
else:
    print("✓ API_KEY loaded successfully")

from app.routers import chat, faq, session

app = FastAPI(
    title="HIV Care Support API",
    description="Backend API for HIV care support application",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with API prefix
app.include_router(chat.router, prefix="/api")
app.include_router(faq.router, prefix="/api")
app.include_router(session.router, prefix="/api")



@app.get("/")
async def root():
    return {"message": "HIV Care Assistance API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api")
async def api_root():
    return {
        "message": "HIV Care Support API",
        "endpoints": {
            "chat": "/api/chat/text",
            "voice_transcribe": "/api/chat/voice/transcribe",
            "faq_search": "/api/faq/search",
            "session": "/api/session"
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

