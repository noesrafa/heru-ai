import { recomendationsFunctions } from "@/utils/functions";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

export async function POST(request: Request) {
  const { recommendation, userContext } = await request.json();

  console.log(
    "\n\n -------------------------------------- \n\n ",
    "AI: ",
    recommendation,
    "\n\n",
    "User: ",
    userContext,
    "\n"
  );

  if (!recommendation || !userContext) {
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

  const messages = [
    {
      role: "system",
      content: `
      Ejecuta la función que más se adecue a la situación: \n
      SI NO TIENE NADA QUE VER CON ESTO O NO SE ENCUENTRA EL SERVICIO EN LA LISTA EJECUTA LA FUNCIÓN ERROR.
      
      Producto recomendado: \n
      ${recommendation}

      Respuesta del usuario: \n
      ${userContext}
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      //@ts-ignore
      messages,
      functions: recomendationsFunctions,
      function_call: "auto",
    });

    console.log(response, "\n\n -------------------------------------- \n\n ");

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
