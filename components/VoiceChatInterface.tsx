'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useVoiceAssistant, 
  BarVisualizer,
  TrackReferenceOrPlaceholder,
  useTranscriptions
} from '@livekit/components-react';
import { 
  Mic, 
  Activity, 
  Shield, 
  FileText, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  BookOpen,
  Stethoscope,
  Pill,
  TestTube
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function VoiceChatInterface() {
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [roomName] = useState('hiv-assistant-' + Math.random(). toString(36).substring(7));

  const connectToRoom = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/token?room=${roomName}&username=patient-${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
      
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Failed to get token:', error);
      alert('Failed to connect. Please check your environment variables and try again.');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setToken('');
    setIsConnecting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {!token ? (
          <LandingScreen onConnect={connectToRoom} isConnecting={isConnecting} />
        ) : (
          <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={disconnect}
          >
            <VoiceChat onDisconnect={disconnect} />
            <RoomAudioRenderer />
          </LiveKitRoom>
        )}
      </div>
    </div>
  );
}

function LandingScreen({ onConnect, isConnecting }: { onConnect: () => void; isConnecting: boolean }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
          <Stethoscope className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          HIV Knowledge Assistant
        </h1>
        <p className="text-gray-600 text-lg">Expert AI guidance on HIV prevention, treatment & care</p>
      </div>

      <div className="mb-8 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg">I can help you with:</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Prevention & Risk Reduction</h4>
              <p className="text-sm text-gray-600">PrEP, PEP, safe practices, and prevention strategies</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Pill className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Treatment & Medications</h4>
              <p className="text-sm text-gray-600">Antiretroviral therapy, drug interactions, and adherence</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TestTube className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Testing & Diagnosis</h4>
              <p className="text-sm text-gray-600">Testing protocols, window periods, and diagnostic procedures</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Clinical Guidelines</h4>
              <p className="text-sm text-gray-600">Latest WHO, CDC, and clinical practice guidelines</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {isConnecting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            Start Voice Consultation
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        🔒 Secure & confidential • Make sure your microphone is enabled
      </p>
    </div>
  );
}

function VoiceChat({ onDisconnect }: { onDisconnect: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedTexts = useRef(new Set<string>());

  const transcriptionStreams = useTranscriptions();

  const upsertMessage = (
    role: 'user' | 'assistant',
    content: string,
    segmentId: string,
    isFinal: boolean
  ) => {
    setMessages(prev => {
      const existingIndex = prev.findIndex(m => m.id === segmentId);
  
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          content,
          timestamp: updated[existingIndex]. timestamp || new Date()
        };
        return updated;
      }
  
      return [
        ...prev,
        {
          id: segmentId,
          role,
          content,
          timestamp: new Date()
        }
      ];
    });
  };

  useEffect(() => {
    if (!transcriptionStreams || transcriptionStreams.length === 0) return;
  
    transcriptionStreams.forEach((stream: any) => {
      const participantIdentity = stream.participantInfo?. identity || "";
      const text = stream.text || "";
      const isFinal = stream.streamInfo?.attributes?.["lk. transcription_final"] === "true";
      const segmentId = stream.streamInfo?.attributes?.["lk. segment_id"] || "";
  
      if (!segmentId || !text. trim()) return;
  
      const isUser = participantIdentity.startsWith("patient") || participantIdentity.startsWith("user");
      const role = isUser ? "user" : "assistant";
  
      upsertMessage(role, text, segmentId, isFinal);
  
      if (isFinal) {
        processedTexts.current.add(segmentId);
      }
    });
  }, [transcriptionStreams]);
  
  useEffect(() => {
    setIsListening(state === 'listening');
  }, [state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getStatusText = () => {
    switch (state) {
      case 'connecting':
        return 'Connecting to HIV Assistant...';
      case 'initializing':
        return 'Initializing assistant...';
      case 'listening':
        return "I'm listening... ";
      case 'thinking':
        return 'Analyzing your question...';
      case 'speaking':
        return 'Providing guidance...';
      default:
        return 'Ready to answer HIV-related questions';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'listening':
        return 'from-green-500 to-emerald-600';
      case 'thinking':
        return 'from-yellow-500 to-orange-600';
      case 'speaking':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div 
              className={`w-24 h-24 bg-gradient-to-br ${getStatusColor()} rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening ?  'animate-pulse scale-110' : ''
              }`}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-white" />
              ) : state === 'speaking' ? (
                <Stethoscope className="w-12 h-12 text-white animate-pulse" />
              ) : (
                <Activity className="w-12 h-12 text-white" />
              )}
            </div>
            {isListening && (
              <>
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 animation-delay-150" />
              </>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">HIV Knowledge Assistant</h2>
          <p className="text-gray-600">{getStatusText()}</p>
        </div>

        {audioTrack && (
          <div className="mb-6">
            <div className="h-24 flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 shadow-inner">
              <BarVisualizer
                state={state}
                barCount={20}
                trackRef={audioTrack as TrackReferenceOrPlaceholder}
                options={{ 
                  minHeight: 4,
                  maxHeight: 60,
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">Sample questions:</h3>
          <div className="space-y-1 text-xs text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>"What is PrEP and who should consider it?"</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0. 5">•</span>
              <span>"How effective are current HIV treatments?"</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>"When should someone get tested for HIV?"</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>"What are the latest HIV prevention guidelines?"</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {showTranscript ? 'Hide' : 'Show'} Conversation
          </button>
          
          <button
            onClick={onDisconnect}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            End Consultation
          </button>
        </div>
      </div>

      {showTranscript && (
        <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Consultation Notes</h3>
            </div>
            <span className="text-sm text-gray-500">{messages.length} exchanges</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: '500px' }}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Your consultation transcript will appear here</p>
                <p className="text-xs mt-2">Ask questions to get evidence-based HIV guidance</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message. role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900 border-l-4 border-blue-500'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.role === 'assistant' && <span className="ml-2">• Evidence-based</span>}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>🔒 All consultations are confidential and based on current HIV guidelines</p>
          </div>
        </div>
      )}
    </div>
  );
}