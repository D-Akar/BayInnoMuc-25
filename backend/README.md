# HIV Care Assistance - Python Backend

Python backend API for the HIV Care Assistance application, built with FastAPI.

## Features

- **RESTful API**: Clean API structure with FastAPI
- **Text Chat**: Placeholder endpoint for text-based conversations
- **Voice Chat**: Placeholder endpoints for audio transcription and synthesis
- **FAQ Search**: Search functionality for frequently asked questions
- **Session Management**: Basic session ID generation

## Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **ASGI Server**: Uvicorn

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API route handlers
│   │   ├── chat.py       # Chat endpoints
│   │   ├── faq.py        # FAQ endpoints
│   │   └── session.py    # Session endpoints
│   └── services/         # Business logic
│       ├── chat_service.py
│       ├── faq_service.py
│       └── voice_service.py
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip or poetry for package management

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

**Development mode (with auto-reload):**
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Chat

- `POST /api/chat/text` - Process text chat message
- `POST /api/chat/voice/transcribe` - Transcribe audio to text
- `POST /api/chat/voice/synthesize` - Synthesize text to speech

### FAQ

- `GET /api/faq/search?q=query` - Search FAQs

### Session

- `POST /api/session` - Create a new session

## Future Backend Integration

The codebase includes clear TODO comments marking integration points for:

1. **AI/LLM Integration**: Replace placeholder responses with GPT-4, Claude, or specialized medical AI
2. **Vector Database**: Implement semantic similarity search for FAQs
3. **Speech-to-Text**: Integrate Whisper, Google Speech-to-Text, or similar
4. **Text-to-Speech**: Integrate ElevenLabs, Google TTS, or similar
5. **Session Management**: Store sessions in Redis, PostgreSQL, or similar
6. **Analytics**: Add conversation logging with privacy considerations
7. **Authentication**: Optional user authentication system
8. **Rate Limiting**: Add rate limiting middleware
9. **Caching**: Implement caching for common queries

## Development

### Code Style

- Follow PEP 8 style guide
- Use type hints for all functions
- Add docstrings to all functions and classes

### Adding New Endpoints

1. Create route handler in `app/routers/`
2. Add business logic in `app/services/`
3. Register router in `main.py`

### Testing

TODO: Add pytest test suite

```bash
# Run tests (when implemented)
pytest
```

## Environment Variables

See `.env.example` for required environment variables.

## CORS Configuration

The backend is configured to allow requests from `http://localhost:3000` by default. Update the CORS settings in `main.py` for production.

## License

[Add your license here]

---

Built with empathy and attention to detail. Every design decision prioritizes user emotional safety and ease of use.

