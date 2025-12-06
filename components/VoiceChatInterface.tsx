"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useVoiceAssistant, 
  useTranscriptions
} from '@livekit/components-react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, X, Loader2, Heart, ChevronDown, MessageCircle, Globe, Shield, PhoneOff } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Transcription {
  id: string;
  text: string;
  role: "user" | "assistant";
  timestamp: Date;
  isFinal: boolean;
}

export default function VoiceChatInterface() {
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [roomName] = useState('hiv-assistant-' + Math.random().toString(36).substring(7));

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const response = await fetch(`/api/token?room=${roomName}&username=patient-${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to get token');
        }
        
        const data = await response.json();
        setToken(data.token);
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to get token:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        alert(`Failed to connect: ${errorMessage}`);
        setIsConnecting(false);
      }
    };

    connectToRoom();
  }, [roomName]);

  const disconnect = () => {
    setToken('');
    setIsConnecting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HIV Care Assistance</h1>
                <p className="text-sm text-gray-600">Voice Support Session</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Confidential & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {isConnecting ? (
          <ConnectingInterface />
        ) : !token ? (
          <ConnectionError />
        ) : (
          <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={disconnect}
            onConnected={() => console.log('🎉 Connected to LiveKit room!')}
            onError={(error) => console.error('💥 LiveKit error:', error)}
          >
            <VoiceChatRoom onDisconnect={disconnect} />
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </div>
    </div>
  );
}

function ConnectingInterface() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Support Assistant</h2>
          <p className="text-gray-600 mb-4">
            Please wait while we connect you to your confidential voice support session.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Establishing secure connection...
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionError() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
          <p className="text-gray-600 mb-6">
            We're having trouble connecting to the support assistant. Please try again.
          </p>
          <Link href="/">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white">
              Return to Support Options
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function VoiceChatRoom({ onDisconnect }: { onDisconnect: () => void }) {
  const { state } = useVoiceAssistant();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true); // FIXED: Simplified state
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false); // FIXED: Track programmatic scrolls

  const transcriptionStreams = useTranscriptions();

  // Force scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      isScrollingProgrammatically.current = true;
      
      // Use scrollIntoView for reliable scrolling
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
      
      setAutoScroll(true);
      
      // Reset flag after animation completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    }
  }, []);

  // FIXED: Better scroll position detection
  const handleScroll = useCallback(() => {
    // Ignore scroll events triggered by our own scrollToBottom function
    if (isScrollingProgrammatically.current) {
      return;
    }

    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      
      // Check if user is at bottom (with 100px threshold for safety)
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom < 100;
      
      setAutoScroll(isAtBottom);
    }
  }, []);

  // FIXED: Auto-scroll when new messages arrive
  useEffect(() => {
    if (transcriptions.length > 0 && autoScroll) {
      // Small delay to ensure DOM has updated
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [transcriptions, autoScroll, scrollToBottom]);

  // Process transcription streams
  useEffect(() => {
    if (!transcriptionStreams || transcriptionStreams.length === 0) {
      return;
    }
    
    transcriptionStreams.forEach((stream: any) => {
      const participantIdentity = stream.participantInfo?.identity || "";
      const text = stream.text || "";
      const isFinal = stream.streamInfo?.attributes?.["lk.transcription_final"] === "true";
      const segmentId = stream.streamInfo?.attributes?.["lk.segment_id"] || `${Date.now()}-${Math.random()}`;
  
      if (!text.trim()) {
        return;
      }
  
      const isUser = participantIdentity.startsWith("patient") || 
                     participantIdentity.startsWith("user") ||
                     participantIdentity.includes("patient");
      const role = isUser ? "user" : "assistant";
      
      setTranscriptions(prev => {
        const existingIndex = prev.findIndex(m => m.id === segmentId);
        
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            text: text,
            isFinal: isFinal,
          };
          return updated;
        }
        
        return [
          ...prev,
          {
            id: segmentId,
            text: text,
            role: role,
            timestamp: new Date(),
            isFinal: isFinal
          }
        ];
      });
    });
  }, [transcriptionStreams]);

  // Simulate volume for visualization
  useEffect(() => {
    let animationFrame: number;
    
    if (state === 'listening') {
      const updateVolume = () => {
        setVolume(Math.random() * 100);
        animationFrame = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } else {
      setVolume(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [state]);

  const isListening = state === 'listening';
  const isProcessing = state === 'thinking';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[calc(100vh-12rem)] relative">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-2xl border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">HIV Support Assistant</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                state === 'listening' ? 'bg-green-500 animate-pulse' : 
                state === 'speaking' ? 'bg-blue-500 animate-pulse' :
                state === 'thinking' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className="text-gray-600 capitalize">{state}</span>
              {transcriptions.length > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{transcriptions.length} messages</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4" />
              <span>Confidential</span>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <PhoneOff className="h-4 w-4 mr-1" />
                End
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Messages Area - FIXED: Better overflow handling */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }} // FIXED: Ensure smooth scrolling
      >
        {transcriptions.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ready to support you
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Welcome to your confidential voice support session. I'm here to provide compassionate, 
                judgment-free assistance with HIV-related questions.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">You can ask me about:</p>
                <ul className="text-left space-y-1">
                  <li>• Prevention and risk reduction</li>
                  <li>• Testing and diagnosis</li>
                  <li>• Treatment options</li>
                  <li>• Living well with HIV</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Start speaking</strong> - your conversation is private and confidential
              </p>
            </div>
          </div>
        )}
        
        {transcriptions.map((transcription) => (
          <div
            key={transcription.id}
            className={`flex ${transcription.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                transcription.role === "user"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-50 text-gray-900 border border-gray-200"
              } ${
                !transcription.isFinal ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <p className="text-base leading-relaxed mb-2 whitespace-pre-wrap break-words">
                {transcription.text}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${
                  transcription.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {transcription.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {!transcription.isFinal && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transcription.role === "user" 
                        ? "bg-blue-700/30 text-blue-100" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      Live
                    </span>
                  )}
                  {transcription.role === "assistant" && transcription.isFinal && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Support
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-amber-50 rounded-2xl px-5 py-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                <span className="text-amber-800 font-medium">Processing your question...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* FIXED: Anchor element for scrolling */}
        <div ref={messagesEndRef} style={{ height: '1px' }} />
      </div>

      {/* FIXED: Scroll to Bottom Button - Only show when not at bottom */}
      {!autoScroll && transcriptions.length > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-32 right-6 bg-blue-900 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg z-20 transition-all transform hover:scale-110 animate-bounce"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Voice Controls */}
      <div className="bg-gray-50 border-t border-gray-200 rounded-b-2xl p-6">
        <div className="flex items-center justify-center gap-8">
          {/* Audio Visualization */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-600 rounded-full transition-all duration-200"
                style={{
                  width: "3px",
                  height: isListening ? `${Math.max(6, Math.random() * 24)}px` : "6px",
                  opacity: isListening ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Main Mic Button */}
          <Button
            size="lg"
            disabled={isProcessing}
            className={`h-20 w-20 rounded-full shadow-xl transition-all transform hover:scale-105 ${
              isListening
                ? "bg-red-600 hover:bg-red-700 animate-pulse"
                : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            <Mic className="h-10 w-10 text-white" />
          </Button>

          {/* Mute Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className="hover:bg-gray-200"
          >
            {isMuted ? <VolumeX className="h-6 w-6 text-gray-600" /> : <Volume2 className="h-6 w-6 text-gray-600" />}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <span className={`text-base font-medium ${
            isListening ? "text-red-600" : isProcessing ? "text-amber-600" : "text-gray-700"
          }`}>
            {isListening ? "Listening - speak freely" : 
             isProcessing ? "Processing your question" : 
             "Tap the microphone to start"}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            Your privacy is protected • Confidential support
          </p>
        </div>
      </div>
    </div>
  );
}