import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/backend/voiceService";

// TODO: Add audio format validation
// TODO: Add file size limits
// TODO: Implement streaming transcription
// TODO: Add language detection
// TODO: Handle different audio codecs

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Convert File to Blob
    const audioBlob = new Blob([await audioFile.arrayBuffer()], {
      type: audioFile.type,
    });

    // Transcribe audio
    const transcription = await transcribeAudio(audioBlob, sessionId);

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

