import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing! Please check your .env file.");
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    // Format response to handle newlines and spaces
    const formattedResponse = result.response
      .text()
      .replace(/\*\*/g, "") // Remove bold formatting (**text**)
      .replace(/\*/g, "") // Remove italic formatting (*text*)
      .replace(/\\n/g, "\n") // Ensure actual new lines
      .replace(/\n/g, "\n\n"); // Add extra spacing between paragraphs for readability

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Generate endpoint is working!",
    timestamp: new Date().toISOString()
  });
} 