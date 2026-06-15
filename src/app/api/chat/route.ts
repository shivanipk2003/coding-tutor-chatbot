import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are CodeBuddy, an expert coding tutor AI assistant. Your role is to:
- Explain programming concepts clearly with examples
- Help debug code by identifying errors and explaining fixes
- Suggest best practices and clean code patterns
- Support all major languages: Python, JavaScript, TypeScript, Java, C++, Go, Rust, etc.
- Give step-by-step explanations for beginners
- Provide concise, expert answers for advanced developers
- Use code blocks with proper syntax highlighting when showing code
- Be encouraging and patient — learning to code is a journey!

Always format code examples using markdown code blocks with the language specified.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
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
