import { NextRequest, NextResponse } from "next/server";
import { processTextMessage } from "@/lib/backend/chatService";

// TODO: Add rate limiting
// TODO: Add input validation and sanitization
// TODO: Add conversation history storage
// TODO: Implement streaming responses
// TODO: Add medical safety checks and disclaimers
// TODO: Log conversations for quality improvement (with privacy considerations)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // TODO: Retrieve conversation history from database
    const conversationHistory = undefined;

    // Process the message
    const response = await processTextMessage(
      message,
      sessionId,
      conversationHistory
    );

    // TODO: Store message and response in conversation history

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing text message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

