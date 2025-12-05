"""
FastAPI application for HIV Care Assistance backend
TODO: Add authentication, rate limiting, logging, and monitoring
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.routers import chat, faq, session

app = FastAPI(
    title="HIV Care Assistance API",
    description="Backend API for compassionate HIV care assistance",
    version="1.0.0",
)

# CORS middleware - configure for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(faq.router, prefix="/api/faq", tags=["faq"])
app.include_router(session.router, prefix="/api/session", tags=["session"])


@app.get("/")
async def root():
    return {"message": "HIV Care Assistance API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

