import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const headers = {
    "Content-Type": "application/json",
    "OpenAI-Beta": "assistants=v1",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY_CUSTOM}`,
  };

  const thread = await fetch("https://api.openai.com/v1/threads/runs", {
    method: "POST",
    body: JSON.stringify({
      assistant_id: "asst_jYC4clrRsW3mN4WHUCIoi6Bf",
      thread: {
        messages: [
          {
            role: "user",
            content: data.userMessage.message,
          },
        ],
      },
    }),
    headers,
  });

  const threadJson = await thread.json();

  async function waitForCompletion() {
    let runJson;
    do {
      const run = await fetch(
        `https://api.openai.com/v1/threads/${threadJson.thread_id}/runs/${threadJson.id}`,
        {
          method: "GET",
          headers,
        }
      );

      runJson = await run.json();

      console.log("\n\n\n", "TRY", runJson);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } while (["in_progress", "queued"].includes(runJson.status));
    {
      if (runJson.status === "completed") {
        return "completed";
      }
      return null;
    }
  }

  const threadCompleted = await waitForCompletion();

  if (threadCompleted === "completed") {
    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadJson.thread_id}/messages`,
      {
        method: "GET",
        headers,
      }
    );

    const responseJson = await response.json();

    console.log("\n\n\n", "RESPONSE", responseJson);

    return NextResponse.json({
      botMessage: responseJson?.data?.[0]?.content?.[0]?.text?.value,
      nextModuleNickname: "",
      responseExpected: true,
    });
  }

  return NextResponse.json({
    botMessage: null,
    nextModuleNickname: "",
    responseExpected: false,
  });
}
