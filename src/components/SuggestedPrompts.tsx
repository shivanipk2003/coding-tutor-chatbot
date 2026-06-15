"use client";

import { useState } from "react";

const categories = [
  {
    label: "Concepts",
    icon: "📚",
    prompts: [
      "Explain recursion with a simple example",
      "What is Big O notation?",
      "Explain the difference between stack and heap",
      "What are design patterns in software?",
    ],
  },
  {
    label: "Languages",
    icon: "💻",
    prompts: [
      "What is the difference between == and === in JavaScript?",
      "How do I reverse a string in Python?",
      "Explain Python list comprehensions",
      "What are TypeScript generics?",
    ],
  },
  {
    label: "Debug",
    icon: "🐛",
    prompts: [
      "Why might my for loop run infinitely?",
      "How do I fix a NullPointerException in Java?",
      "What causes a stack overflow error?",
      "How do I debug async/await issues in JavaScript?",
    ],
  },
  {
    label: "Interview",
    icon: "💼",
    prompts: [
      "Explain the difference between SQL and NoSQL",
      "What is the time complexity of quicksort?",
      "Explain microservices vs monolithic architecture",
      "What are the SOLID principles?",
    ],
  },
];

type Props = {
  onSelect: (prompt: string) => void;
};

export default function SuggestedPrompts({ onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="mt-6">
      <div className="flex gap-2 justify-center mb-4 flex-wrap">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === i
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categories[activeCategory].prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="text-left text-xs text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 hover:border-violet-500/50 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/5 group"
          >
            <span className="group-hover:text-violet-300 transition-colors">{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
