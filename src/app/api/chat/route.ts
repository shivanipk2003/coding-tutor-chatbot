import Groq from "groq-sdk";
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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const groqMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...messages.map(
        (msg: { role: string; content: string }) => ({
          role:
            msg.role === "assistant"
              ? ("assistant" as const)
              : ("user" as const),
          content: msg.content,
        })
      ),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const text =
      completion.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      message: text,
    });
  } catch (error) {
    console.error("Groq API error:", error);

    return NextResponse.json(
      {
        error: "Failed to get response from AI.",
      },
      {
        status: 500,
      }
    );
  }
}