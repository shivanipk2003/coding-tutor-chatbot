"use client";

import React from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  message: Message;
};

function formatContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0].trim();
      const code = lines.slice(1).join("\n").trim();
      return (
        <div key={i} className="my-3 rounded-lg overflow-hidden border border-gray-700">
          {lang && (
            <div className="bg-gray-800 px-4 py-1 text-xs text-blue-400 font-mono border-b border-gray-700">
              {lang}
            </div>
          )}
          <pre className="bg-gray-900 p-4 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start mb-4`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
        }`}
      >
        {isUser ? "You" : "CB"}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
        }`}
      >
        {formatContent(message.content)}
      </div>
    </div>
  );
}
