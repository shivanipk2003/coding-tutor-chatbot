"use client";

const suggestions = [
  "Explain recursion with a simple example",
  "What is the difference between == and === in JavaScript?",
  "How do I reverse a string in Python?",
  "Explain Big O notation simply",
  "What are React hooks and when should I use them?",
  "Debug my code: why is my for loop infinite?",
];

type Props = {
  onSelect: (prompt: string) => void;
};

export default function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-left text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl px-4 py-3 transition-all duration-150"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
