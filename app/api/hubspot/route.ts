import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const headers = {
    "Content-Type": "application/json",
    "OpenAI-Beta": "assistants=v1",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY_CUSTOM}`,
  };

  async function waitForCompletion(thread_id: string, run_id: string) {
    let runJson;
    do {
      const run = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
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

  try {
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
    console.log("\n\n\n", "THREAD", threadJson);

    const threadCompleted = await waitForCompletion(
      threadJson.thread_id,
      threadJson.id
    );

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
