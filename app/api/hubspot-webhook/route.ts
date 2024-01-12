import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const isDevelopment = process.env.NODE_ENV;
  const API_URL = isDevelopment
    ? "http://localhost:3000"
    : "https://heru-ai-noesrafa.vercel.app";

    if (false) {
      return NextResponse.json({
        "hola": API_URL + "/api/openai",
        "data": data.userMessage.message,
      });
    }

  const response = await fetch("https://heru-ai-noesrafa.vercel.app/api/openai-webhook", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: data.userMessage.message,
        },
      ],
    }),
  });

  const responseJson = await response.json();
  console.log(responseJson);

  if (responseJson?.choices?.[0]?.finish_reason === "function_call") {
    const functionName = responseJson.choices[0]?.message?.function_call?.name;
    console.log(functionName);
    if (functionName === "talk_to_human") {
      return NextResponse.json({
        botMessage: null,
        nextModuleNickname: "",
        responseExpected: false,
      });
    }
  }
  

  return NextResponse.json({
    botMessage: responseJson.choices?.[0].message.content,
    nextModuleNickname: "",
    responseExpected: true,
  });
}
