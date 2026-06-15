"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage, { Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SuggestedPrompts from "@/components/SuggestedPrompts";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
          CB
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-none">CodeBuddy</h1>
          <p className="text-xs text-gray-400 mt-0.5">Your AI Coding Tutor · Powered by Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="text-center mt-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl mb-4 shadow-lg">
                👨‍💻
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to CodeBuddy!</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                I can help you learn programming, debug your code, explain concepts, and guide you
                through any coding challenge. What would you like to learn today?
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
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    CB
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3">
                    <span className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="flex-shrink-0 border-t border-gray-800 bg-gray-900 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            isLoading={isLoading}
          />
          <p className="text-center text-xs text-gray-600 mt-2">
            CodeBuddy may make mistakes. Always verify important code in your environment.
          </p>
        </div>
      </footer>
    </div>
  );
}
