import { welcomeFunctions } from "@/utils/functions";
import { welcomePrompt } from "@/utils/prompts";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

const getCorsHeaders = (origin: string) => {
  const headers = {
    "Access-Control-Allow-Methods": `${process.env.ALLOWED_METHODS}`,
    "Access-Control-Allow-Headers": `${process.env.ALLOWED_HEADERS}`,
    "Access-Control-Allow-Origin": `${process.env.DOMAIN_URL}`,
  };

  // If no allowed origin is set to default server origin
  if (!process.env.ALLOWED_ORIGIN || !origin) return headers;

  // If allowed origin is set, check if origin is in allowed origins
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");

  // Validate server origin
  if (allowedOrigins.includes("*")) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  // Return result
  return headers;
};

export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};

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
      // model: "gpt-4-0613",
      model: "gpt-3.5-turbo-1106",
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

    return NextResponse.json(response, {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    });
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
