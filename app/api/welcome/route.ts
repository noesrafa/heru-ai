import { welcomeFunctions } from "@/utils/functions";
import { welcomePrompt } from "@/utils/prompts";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

export async function POST(request: Request) {
  const { message } = await request.json();

  console.log(
    "\n\n -------------------------------------- \n\n ",
    "User: ",
    message,
    "\n"
  );

  if (!message) {
    return NextResponse.json({ message: "Query is required" });
  }

  if (process.env.OPENAI_API_KEY_CUSTOM === undefined) {
    console.log("No API key provided.");
    return NextResponse.json(
      {
        message: "No API key provided.",
      },
      {
        status: 401,
      }
    );
  }

  const messages_chat = [
    {
      role: "system",
      content: welcomePrompt(),
    },
    {
      role: "user",
      content: message,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      //@ts-ignore
      messages: messages_chat,
      functions: welcomeFunctions,
      function_call: "auto",
    });

    console.log(
      "Response: ",
      response?.choices?.[0]?.message?.content || "No response found",
      "\n\nTokens: ",
      response?.usage?.total_tokens,
      "\n\n -------------------------------------- \n\n "
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 401,
      }
    );
  }
}
