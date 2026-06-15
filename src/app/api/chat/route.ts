import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const BASE_SYSTEM_PROMPT = `You are CodeBuddy, an expert coding tutor AI assistant. Your role is to:
- Explain programming concepts clearly with examples
- Help debug code by identifying errors and explaining fixes
- Suggest best practices and clean code patterns
- Support all major languages: Python, JavaScript, TypeScript, Java, C++, Go, Rust, etc.
- Be encouraging and patient — learning to code is a journey!

Always format code examples using markdown code blocks with the language specified (e.g. \`\`\`python).
Use inline code with backticks for short code references. Use **bold** for key terms.`;

const SKILL_INSTRUCTIONS: Record<string, string> = {
  Beginner:
    "The user is a beginner. Use simple language, avoid jargon, give step-by-step explanations, use relatable analogies, and always include basic runnable examples. Encourage them frequently.",
  Intermediate:
    "The user has intermediate knowledge. You can use technical terms but briefly explain them. Focus on best practices, common pitfalls, and design patterns.",
  Advanced:
    "The user is advanced. Be concise and precise. Use technical terminology freely. Focus on edge cases, performance trade-offs, and advanced patterns. Skip the basics.",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages, skillLevel = "Beginner" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${SKILL_INSTRUCTIONS[skillLevel] ?? SKILL_INSTRUCTIONS.Beginner}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI. Please check your API key." },
      { status: 500 }
    );
  }
}
