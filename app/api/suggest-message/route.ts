import { streamText, APICallError } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";

const fallbackQuestionsSets = [
  "What's something you've always wanted to try but have been too afraid to do? || If you could live in any fictional world, which one would it be and why? || What's the best piece of advice you've ever received?",
  "What is your dream vacation destination? || What is a skill you wish you possessed? || What movie never fails to make you laugh?",
  "What is your favorite memory from childhood? || If you could master any language instantly, which one would it be? || What's a hidden talent you have?",
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Pick a random fallback set if Groq API key is not configured
      const randomIndex = Math.floor(Math.random() * fallbackQuestionsSets.length);
      return new Response(fallbackQuestionsSets[randomIndex], {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const groq = createGroq({ apiKey });
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      maxOutputTokens: 400,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Suggest message route error:", error);
    // Return fallback question set on error
    const randomIndex = Math.floor(Math.random() * fallbackQuestionsSets.length);
    return new Response(fallbackQuestionsSets[randomIndex], {
      headers: { "Content-Type": "text/plain" },
    });
  }
}
