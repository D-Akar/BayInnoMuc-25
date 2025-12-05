"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TextChatInterfaceProps {
  locale: string;
}

export default function TextChatInterface({ locale: localeProp }: TextChatInterfaceProps) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const locale = localeProp || currentLocale;
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t("textChat.initialMessage"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);
  const previousMessagesLength = useRef(1); // Start with 1 for the initial message

  // Initialize session
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Ensure messages container starts at top on initial mount
  useEffect(() => {
    if (isInitialMount.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
      isInitialMount.current = false;
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive (but not on initial mount)
  useEffect(() => {
    // Only scroll if a new message was added (messages.length increased)
    if (messages.length > previousMessagesLength.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      previousMessagesLength.current = messages.length;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSuggestions([]);

    try {
      // Get conversation history (exclude the message we just added)
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update suggestions
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }

      // Log which model was used (optional)
      if (data.modelUsed) {
        console.log("Response from model:", data.modelUsed);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("textChat.error"),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndConversation = () => {
    router.push(`/${locale}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href={`/${locale}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("textChat.back")}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleEndConversation}>
              <X className="h-4 w-4 mr-2" />
              {t("textChat.endConversation")}
            </Button>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 flex flex-col h-[calc(100vh-12rem)]">
            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-primary-100"
                          : "text-neutral-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                    <p className="text-neutral-500 text-sm">{t("textChat.thinking")}</p>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {!isLoading && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-start">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={t("textChat.placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || !sessionId}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || !sessionId}
                  size="default"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                {t("common.confidentialText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}