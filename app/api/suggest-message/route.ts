import { streamText, APICallError } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      maxOutputTokens: 400,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (APICallError.isInstance(error)) {
      const { name, message, statusCode, url } = error;
      return NextResponse.json(
        { name, message, status: statusCode, url },
        { status: statusCode ?? 500 },
      );
    }
    console.error("An unexpected error occurred", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
