"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

type Props = {
  message: Message;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2.5 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-150 font-mono"
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

function parseContent(content: string) {
  const codeBlockParts = content.split(/(```[\s\S]*?```)/g);

  return codeBlockParts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0].trim() || "text";
      const code = lines.slice(1).join("\n").trim();

      return (
        <div key={i} className="my-3 rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
          <div className="flex items-center justify-between bg-[#1e2433] px-4 py-2 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-violet-400 font-mono font-semibold">{lang}</span>
            </div>
            <CopyButton text={code} />
          </div>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.78rem",
              background: "#0d1117",
              padding: "1rem",
            }}
            lineNumberStyle={{ color: "#4b5563", fontSize: "0.7rem" }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    const inlineParts = part.split(/(`[^`\n]+`|\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {inlineParts.map((inline, j) => {
          if (inline.startsWith("`") && inline.endsWith("`") && inline.length > 2) {
            return (
              <code
                key={j}
                className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700/50"
              >
                {inline.slice(1, -1)}
              </code>
            );
          }
          if (inline.startsWith("**") && inline.endsWith("**") && inline.length > 4) {
            return (
              <strong key={j} className="font-semibold text-white">
                {inline.slice(2, -2)}
              </strong>
            );
          }
          return (
            <span key={j} className="whitespace-pre-wrap">
              {inline}
            </span>
          );
        })}
      </span>
    );
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start mb-6`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
            : "bg-gradient-to-br from-violet-600 to-purple-600 text-white"
        }`}
      >
        {isUser ? "You" : "CB"}
      </div>

      <div className={`max-w-[82%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-none"
              : "bg-gray-800/90 text-gray-100 rounded-tl-none border border-gray-700/50 backdrop-blur-sm"
          }`}
        >
          {parseContent(message.content)}
        </div>
        {message.timestamp && (
          <span className="text-[10px] text-gray-600 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
