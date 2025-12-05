import { NextRequest, NextResponse } from "next/server";
import { processTextMessage } from "@/lib/backend/chatService";

// TODO: Add rate limiting
// TODO: Add input validation and sanitization
// TODO: Add conversation history storage
// TODO: Implement streaming responses
// TODO: Add medical safety checks and disclaimers
// TODO: Log conversations for quality improvement (with privacy considerations)

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, conversationHistory } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    console.log(`Forwarding request to backend: ${BACKEND_URL}/api/chat/text`);

    // Forward request to Python backend
    const response = await fetch(`${BACKEND_URL}/api/chat/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
        conversationHistory: conversationHistory || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Backend error:", error);
      throw new Error(error.detail || "Backend request failed");
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response,
      suggestions: data.suggestions || [],
      sessionId: data.session_id,
      modelUsed: data.model_used, // Include which model was used
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        suggestions: ["Try again", "Browse FAQs", "Contact support"],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

