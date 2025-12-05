"""
Chat API routes
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import base64

from app.services.chat_service import (
    process_text_message,
    get_available_models,
    get_primary_model
)
from app.services import voice_service

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str
    content: str


class TextChatRequest(BaseModel):
    message: str
    sessionId: str
    conversationHistory: Optional[List[ChatMessage]] = None
    preferredModel: Optional[str] = None  # Allow client to request specific model


class TextChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    session_id: str
    model_used: Optional[str] = None  # Show which model was used


@router.post("/text", response_model=TextChatResponse)
async def text_chat(request: TextChatRequest):
    """
    Process a text chat message and return AI response.
    """
    try:
        # Convert Pydantic models to dictionaries
        history = None
        if request.conversationHistory:
            history = [msg.dict() for msg in request.conversationHistory]

        # Process the message
        result = process_text_message(
            message=request.message,
            session_id=request.sessionId,
            conversation_history=history,
            preferred_model=request.preferredModel,
        )

        return TextChatResponse(**result)

    except Exception as e:
        print(f"Error in text chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models")
async def list_models():
    """
    Get list of available LLM models and current primary model.
    """
    return {
        "primary_model": get_primary_model(),
        "available_models": get_available_models(),
    }


@router.post("/voice/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    sessionId: str = Form(...),
):
    """
    Transcribe audio to text
    """
    try:
        if not audio:
            raise HTTPException(status_code=400, detail="Audio file is required")

        if not sessionId:
            raise HTTPException(status_code=400, detail="Session ID is required")

        # Read audio data
        audio_data = await audio.read()

        # Transcribe audio
        transcription = await voice_service.transcribe_audio(audio_data, sessionId)

        return {"transcription": transcription}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# @router.post("/voice/synthesize")
# async def synthesize_speech(request: SynthesizeRequest):
#     """
#     Synthesize text to speech audio
#     TODO: Add text length limits
#     TODO: Implement streaming audio generation
#     TODO: Add voice customization options
#     TODO: Cache generated audio for common responses
#     """
#     try:
#         if not request.text or not isinstance(request.text, str):
#             raise HTTPException(status_code=400, detail="Text is required and must be a string")

#         if not request.sessionId or not isinstance(request.sessionId, str):
#             raise HTTPException(status_code=400, detail="Session ID is required")

#         # Synthesize speech
#         audio_bytes = await voice_service.synthesize_speech(request.text, request.sessionId)

#         # Return audio as response
#         return Response(
#             content=audio_bytes,
#             media_type="audio/mpeg",
#             headers={"Content-Length": str(len(audio_bytes))},
#         )
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Error synthesizing speech: {e}")
#         raise HTTPException(status_code=500, detail="Internal server error")

