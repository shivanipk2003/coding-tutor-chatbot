"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import Sidebar from "@/components/Sidebar";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

const skillStyles: Record<SkillLevel, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const skillTextColor: Record<SkillLevel, string> = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-red-400",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: "user", content, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, skillLevel }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, timestamp: new Date() },
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${errorMessage}`, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="hidden md:block w-52 flex-shrink-0">
          <Sidebar onTopicSelect={(prompt) => sendMessage(prompt)} />
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            title="Toggle sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-violet-500/20">
            CB
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-none">CodeBuddy</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">AI Coding Tutor · Powered by Gemini</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-gray-600 hidden sm:block">Level:</span>
            <div className="flex gap-1">
              {(["Beginner", "Intermediate", "Advanced"] as SkillLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSkillLevel(level)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all duration-200 ${
                    skillLevel === level
                      ? skillStyles[level]
                      : "bg-transparent text-gray-600 border-gray-800 hover:border-gray-600 hover:text-gray-400"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-600 hidden sm:block">Online</span>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="text-center mt-8">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex items-center justify-center text-4xl shadow-2xl shadow-violet-500/30">
                    👨‍💻
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-950 flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to CodeBuddy!</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-1">
                  Your AI-powered coding tutor. Ask anything — concepts, debugging, code review.
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Answering in{" "}
                  <span className={`font-semibold ${skillTextColor[skillLevel]}`}>{skillLevel}</span> mode
                </p>
                <SuggestedPrompts onSelect={(p) => sendMessage(p)} />
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 items-start mb-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      CB
                    </div>
                    <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-none px-4 py-3 backdrop-blur-sm">
                      <span className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="flex-shrink-0 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => sendMessage()}
              isLoading={isLoading}
            />
            <p className="text-center text-[10px] text-gray-700 mt-2">
              CodeBuddy may make mistakes. Always verify important code in your environment.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
