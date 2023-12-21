import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const response = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: data.userMessage.message,
        },
      ],
    }),
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v1",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY_CUSTOM}`,
    },
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
