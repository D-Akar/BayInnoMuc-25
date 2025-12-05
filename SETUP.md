# Setup Guide

This guide will help you set up both the frontend and backend for the HIV Care Assistance application.

## Quick Start

### 1. Backend Setup (Python)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

The backend will start on `http://localhost:8000`

You can verify it's working by visiting:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Frontend Setup (Next.js)

Open a **new terminal** window:

```bash
# From project root (not backend folder)
npm install

# Run the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Verify Connection

1. Open http://localhost:3000 in your browser
2. The frontend should automatically connect to the backend at http://localhost:8000
3. Try the chat features to verify the connection

## Environment Configuration

### Backend

The backend uses environment variables. Copy `.env.example` to `.env` in the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` to configure:
- Server host and port
- CORS origins
- API keys (for future integrations)

### Frontend

The frontend is configured to connect to `http://localhost:8000` by default.

To change the backend URL, create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development Workflow

1. **Start Backend First**: Always start the Python backend before the frontend
2. **Keep Both Running**: You need both servers running simultaneously
3. **Backend Changes**: The backend auto-reloads when you make changes (if using `python main.py`)
4. **Frontend Changes**: Next.js hot-reloads automatically

## Troubleshooting

### Backend won't start

- Check Python version: `python --version` (needs 3.9+)
- Verify virtual environment is activated
- Check if port 8000 is already in use
- Review error messages in terminal

### Frontend can't connect to backend

- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `NEXT_PUBLIC_API_URL` in frontend config
- Check browser console for CORS errors

### Port conflicts

- Backend default: 8000 (change in `backend/main.py`)
- Frontend default: 3000 (change with `npm run dev -- -p 3001`)

## Production Deployment

### Backend

- Use a production ASGI server like Gunicorn with Uvicorn workers
- Set up proper CORS origins
- Use environment variables for all configuration
- Enable HTTPS

### Frontend

- Build: `npm run build`
- Start: `npm start`
- Configure `NEXT_PUBLIC_API_URL` to point to production backend

## Next Steps

- Review `backend/README.md` for backend-specific documentation
- Review main `README.md` for project overview
- Check TODO comments in code for integration points

