# HIV Care Assistance - Next.js Application

A compassionate, accessible web application providing confidential HIV care assistance. Built with Next.js 14+, TypeScript, and Tailwind CSS, designed with empathy and attention to user emotional safety.

## Features

- **Landing Page**: Warm, welcoming interface with hero section, FAQ section, and chat options
- **FAQ Section**: Searchable, categorized frequently asked questions with compassionate answers
- **Text Chat Interface**: Real-time text-based support with message history
- **Voice Chat Interface**: Voice-based interaction with audio visualization
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast, focus states, and screen reader support

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React

## Project Structure

```
├── backend/                     # Python backend (separate application)
│   ├── app/
│   │   ├── routers/            # API route handlers
│   │   │   ├── chat.py
│   │   │   ├── faq.py
│   │   │   └── session.py
│   │   └── services/           # Business logic
│   │       ├── chat_service.py
│   │       ├── faq_service.py
│   │       └── voice_service.py
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
│   └── README.md               # Backend documentation
├── app/                        # Next.js frontend
│   ├── chat/
│   │   ├── text/               # Text chat page
│   │   └── voice/              # Voice chat page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── ChatOptions.tsx         # Chat option cards
│   ├── FAQSection.tsx          # FAQ accordion section
│   ├── Hero.tsx                # Landing page hero
│   ├── Layout.tsx              # Shared layout wrapper
│   ├── TextChatInterface.tsx   # Text chat UI
│   └── VoiceChatInterface.tsx  # Voice chat UI
└── lib/
    ├── config.ts               # API endpoint configuration
    ├── backend/                # Frontend service files (for client-side FAQ)
    │   └── faqService.ts        # FAQ data (can also use backend API)
    └── utils.ts                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm (for frontend)
- Python 3.9+ and pip (for backend)
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BayInnoMuc-25
```

2. **Setup Backend (Python):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Setup Frontend (Next.js):**
```bash
# From project root
npm install
# or
yarn install
# or
pnpm install
```

### Running the Application

**Start the Backend:**
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

**Start the Frontend (in a separate terminal):**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# Frontend runs on http://localhost:3000
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The frontend is configured to connect to the backend at `http://localhost:8000` by default. You can change this by setting the `NEXT_PUBLIC_API_URL` environment variable.

### Building for Production

```bash
npm run build
npm start
```

## Architecture Overview

### Frontend (Next.js)

The frontend is fully implemented with:

- **Landing Page** (`app/page.tsx`): Main entry point with hero, FAQ, and chat options
- **Text Chat** (`app/chat/text/page.tsx`): Real-time text messaging interface
- **Voice Chat** (`app/chat/voice/page.tsx`): Voice interaction with audio visualization
- **Components**: Reusable, accessible UI components built with Radix UI primitives
- **API Client**: Configured to communicate with Python backend via `lib/config.ts`

### Backend (Python/FastAPI)

The backend is a separate Python application located in the `backend/` folder:

- **Framework**: FastAPI with async support
- **API Routes**: RESTful endpoints for chat, FAQ, and session management
- **Services**: Business logic separated into service modules
- **Placeholder Functions**: Clear TODO comments for future AI integration

**Backend Endpoints:**
- `POST /api/chat/text` - Text message processing (TODO: AI/LLM integration)
- `POST /api/chat/voice/transcribe` - Audio transcription (TODO: Speech-to-text service)
- `POST /api/chat/voice/synthesize` - Text-to-speech (TODO: TTS service)
- `GET /api/faq/search` - FAQ search (TODO: Vector database similarity search)
- `POST /api/session` - Session management (TODO: Database storage)

See `backend/README.md` for detailed backend setup instructions.

### Design System

- **Colors**: Warm, compassionate palette (coral/peach, warm blues, gentle purples)
- **Typography**: Inter/Open Sans for readability
- **Spacing**: Generous padding and margins
- **Border Radius**: 12-16px for friendly, approachable feel
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios

## Future Backend Integration

The codebase includes clear TODO comments marking integration points for:

1. **AI/LLM Integration**: Replace placeholder responses with GPT-4, Claude, or specialized medical AI
2. **Vector Database**: Implement semantic similarity search for FAQs
3. **Speech-to-Text**: Integrate Whisper, Google Speech-to-Text, or similar
4. **Text-to-Speech**: Integrate ElevenLabs, Google TTS, or similar
5. **Session Management**: Store sessions in Redis, PostgreSQL, or similar
6. **Analytics**: Add conversation logging with privacy considerations
7. **Authentication**: Optional user authentication system

## Content Guidelines

All content follows these principles:

- **Compassionate**: "We understand this can be difficult"
- **Clear**: Avoid medical jargon, explain when necessary
- **Non-judgmental**: Never assume or imply blame
- **Empowering**: Provide actionable information
- **Confidential**: Reinforce privacy repeatedly

## Legal & Ethical Disclaimers

The application includes:

- Prominent notice that this is an informational tool, not medical advice
- Emergency contact information
- Links to professional resources
- Privacy policy information

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured with Next.js defaults
- Components use functional components with hooks
- Accessibility attributes included throughout

### Adding New FAQs

Edit `lib/backend/faqService.ts` to add new FAQ items to the `faqData` array.

### Customizing Colors

Edit `tailwind.config.ts` to modify the color palette.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[Add your license here]

## Support

For questions or issues, please [add your contact information or issue tracker].

---

Built with empathy and attention to detail. Every design decision prioritizes user emotional safety and ease of use.

