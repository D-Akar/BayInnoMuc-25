import { NextRequest, NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/backend/voiceService";

// TODO: Add text length limits
// TODO: Implement streaming audio generation
// TODO: Add voice customization options
// TODO: Cache generated audio for common responses

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sessionId } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Synthesize speech
    const audioBlob = await synthesizeSpeech(text, sessionId);

    // Return audio as response
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBlob.size.toString(),
      },
    });
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

