// Backend API configuration
// TODO: Move to environment variables for production

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  session: `${API_BASE_URL}/api/session`,
  chatText: `${API_BASE_URL}/api/chat/text`,
  chatVoiceTranscribe: `${API_BASE_URL}/api/chat/voice/transcribe`,
  chatVoiceSynthesize: `${API_BASE_URL}/api/chat/voice/synthesize`,
  faqSearch: `${API_BASE_URL}/api/faq/search`,
} as const;

