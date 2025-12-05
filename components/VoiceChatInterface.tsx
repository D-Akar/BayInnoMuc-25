"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { API_ENDPOINTS } from "@/lib/config";

interface Transcription {
  text: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function VoiceChatInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize session
  useEffect(() => {
    async function initSession() {
      try {
        const response = await fetch(API_ENDPOINTS.session, { method: "POST" });
        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error("Failed to initialize session:", error);
      }
    }
    initSession();
  }, []);

  // Volume visualization
  useEffect(() => {
    if (isRecording && audioContextRef.current && analyserRef.current) {
      const updateVolume = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average);

        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };
      updateVolume();
    } else {
      setVolume(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for volume visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Unable to access microphone. Please check your permissions and try again."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    if (!sessionId) return;

    setIsProcessing(true);

    try {
      // Transcribe audio
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("sessionId", sessionId);

      const transcribeResponse = await fetch(API_ENDPOINTS.chatVoiceTranscribe, {
        method: "POST",
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed");
      }

      const { transcription } = await transcribeResponse.json();

      // Add user transcription
      setTranscriptions((prev) => [
        ...prev,
        {
          text: transcription,
          role: "user",
          timestamp: new Date(),
        },
      ]);

      // TODO: Process transcription through chat service and get response
      // For now, use a placeholder response
      const responseText =
        "Thank you for your message. I'm here to provide you with compassionate support and information about HIV care. How can I help you today?";

      // Add assistant transcription
      setTranscriptions((prev) => [
        ...prev,
        {
          text: responseText,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);

      // TODO: Synthesize response to speech and play it
      // const synthesizeResponse = await fetch(API_ENDPOINTS.chatVoiceSynthesize, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ text: responseText, sessionId }),
      // });
      // const audioBlob = await synthesizeResponse.blob();
      // const audio = new Audio(URL.createObjectURL(audioBlob));
      // if (!isMuted) {
      //   audio.play();
      // }
    } catch (error) {
      console.error("Error processing audio:", error);
      setTranscriptions((prev) => [
        ...prev,
        {
          text:
            "I'm sorry, I'm having trouble processing your audio. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/chat/text">
                <Button variant="ghost" size="sm">
                  Switch to Text
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  End Conversation
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Chat Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 flex flex-col h-[calc(100vh-12rem)]">
            {/* Transcriptions Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {transcriptions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-600 text-lg mb-2">
                    Click the microphone to start talking
                  </p>
                  <p className="text-sm text-neutral-500">
                    Your conversation is private and confidential
                  </p>
                </div>
              )}
              {transcriptions.map((transcription, index) => (
                <div
                  key={index}
                  className={`flex ${
                    transcription.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      transcription.role === "user"
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    <p className="text-base leading-relaxed">
                      {transcription.text}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        transcription.role === "user"
                          ? "text-primary-100"
                          : "text-neutral-500"
                      }`}
                    >
                      {transcription.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Voice Controls */}
            <div className="border-t border-neutral-200 p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Audio Wave Visualization */}
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-center gap-1 h-16">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const barHeight =
                        isRecording && volume > 0
                          ? Math.max(4, (volume / 255) * 60 + Math.random() * 20)
                          : 4;
                      return (
                        <div
                          key={i}
                          className="bg-primary-500 rounded-full transition-all duration-100"
                          style={{
                            width: "4px",
                            height: `${barHeight}px`,
                            opacity: isRecording ? 1 : 0.3,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </Button>

                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing || !sessionId}
                    className={`h-20 w-20 rounded-full ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-primary-500 hover:bg-primary-600"
                    }`}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isRecording ? (
                      <MicOff className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>

                  <div className="text-sm text-neutral-600 text-center min-w-[100px]">
                    {isRecording ? (
                      <span className="text-red-600 font-medium">Recording...</span>
                    ) : isListening ? (
                      <span>Processing...</span>
                    ) : (
                      <span>Tap to talk</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-500 text-center">
                  {isRecording
                    ? "Speak now... Click again to stop"
                    : "Your conversation is private and confidential"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

