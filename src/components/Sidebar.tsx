"use client";

import { useState } from "react";

const topics = [
  {
    section: "Fundamentals",
    icon: "📚",
    items: [
      { label: "Variables & Types", prompt: "Explain variables and data types with examples" },
      { label: "Functions", prompt: "Explain functions and how to write clean, reusable functions" },
      { label: "Loops", prompt: "Explain different types of loops and when to use each" },
      { label: "Recursion", prompt: "Explain recursion with a beginner-friendly example" },
    ],
  },
  {
    section: "Data Structures",
    icon: "🏗️",
    items: [
      { label: "Arrays & Lists", prompt: "Explain arrays and lists with practical examples" },
      { label: "Hash Maps", prompt: "Explain hash maps/dictionaries and when to use them" },
      { label: "Trees & Graphs", prompt: "Explain trees and graphs with visual examples" },
      { label: "Stacks & Queues", prompt: "Explain stacks and queues with real-world analogies" },
    ],
  },
  {
    section: "Algorithms",
    icon: "⚡",
    items: [
      { label: "Sorting", prompt: "Explain the most common sorting algorithms and their complexities" },
      { label: "Big O Notation", prompt: "Explain Big O notation with simple practical examples" },
      { label: "Binary Search", prompt: "Explain binary search and implement it step by step" },
      { label: "Dynamic Programming", prompt: "Explain dynamic programming with a simple example" },
    ],
  },
  {
    section: "Debugging",
    icon: "🐛",
    items: [
      { label: "Common Errors", prompt: "What are the most common programming errors and how do I fix them?" },
      { label: "Debugging Tips", prompt: "What are the best debugging strategies for beginners?" },
      { label: "Code Review", prompt: "How do I review my own code effectively?" },
    ],
  },
  {
    section: "Interview Prep",
    icon: "💼",
    items: [
      { label: "Problem Solving", prompt: "How should I approach coding interview problems?" },
      { label: "System Design", prompt: "Explain the basics of system design for interviews" },
      { label: "SOLID Principles", prompt: "Explain SOLID principles with code examples" },
    ],
  },
];

type Props = {
  onTopicSelect: (prompt: string) => void;
};

export default function Sidebar({ onTopicSelect }: Props) {
  const [expanded, setExpanded] = useState<string | null>("Fundamentals");

  return (
    <div className="h-full flex flex-col bg-gray-900/50 border-r border-gray-800 overflow-y-auto">
      <div className="px-4 py-3.5 border-b border-gray-800">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Topics</p>
      </div>
      <div className="flex-1 py-1">
        {topics.map((section) => (
          <div key={section.section} className="mb-0.5">
            <button
              onClick={() => setExpanded(expanded === section.section ? null : section.section)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.section}</span>
              </span>
              <span
                className={`text-gray-500 transition-transform duration-200 ${
                  expanded === section.section ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>
            {expanded === section.section && (
              <div className="ml-6 border-l border-gray-700/50">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onTopicSelect(item.prompt)}
                    className="w-full text-left px-4 py-1.5 text-xs text-gray-500 hover:text-violet-300 hover:bg-violet-500/5 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
