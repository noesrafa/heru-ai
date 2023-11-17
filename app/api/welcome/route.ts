import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.log(
    "\n -------------------------------------- \n ",
    messages,
    "\n -------------------------------------- \n "
  );

  if (!messages) {
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

  const isDevelopment = process.env.NODE_ENV;
  const API_URL = isDevelopment
    ? "https://gpt-v2-git-main-noesrafa.vercel.app/api/"
    : "http://localhost:3000/api/";

  const responsePinecone = await fetch(API_URL + "pinecone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: messages[messages.length - 1].content,
      sendDocs: false,
    }),
  });

  const context = await responsePinecone.json();

  const formatedContext = context
    .map((text: any) => text.pageContent)
    .join("\n");

  const messages_chat = [
    {
      role: "system",
      content: `
      Debes recomendar el servicio de acuerdo a las reglas:
      NO HAGAS PREGUNTAS Y RECOMIENDA EL SERVICIO DE ACUERDO A LAS REGLAS:
      
      SERVICIO: FACTURACIÓN
      REGLAS: el usuario menciono: "factura", "quiero facturar"
      RECOMENDACION: "Te recomendamos nuestro servicio de facturación, es completamente gratis!"

      SERVICIO: DECLARACION MENSUAL
      REGLAS: el usuario menciono: "declaración", "mensual", "presentar mis impuestos
      RECOMENDACION: "Te recomendamos nuestro servicio de declaración mensual, que actividades realizas?"

      SERVICIO: DECLARACIÓN ANUAL
      REGLAS: el usuario menciono: "declaración", "anual", "presentar mi anual", "mi declaracion de 2023"
      RECOMENDACION: "Te recomendamos nuestro servicio de declaración anual, que actividades realizas?"

      SERVICIO: DECLARACIONES ATRASADAS
      REGLAS: el usuario menciono: "declaración", "atrasada", "presentar mis impuestos atrasados", "Quiero estar al dia", "no he presentado mis impuestos", "meses pendientes" 
      RECOMENDACION: "Te recomendamos nuestro servicio de declaración atrasada, que actividades realizas?"

      SERVICIO: CONSTANCIA DE SITUACIÓN FISCAL
      REGLAS: el usuario menciono: "constancia", "situación fiscal"
      RECOMENDACION: "Te recomendamos nuestro servicio de constancia de situación fiscal, que actividades realizas?"

      SERVICIO: AYUDA CON EL SAT
      REGLAS: el usuario menciono: "ayuda", "sat", "ayuda con un tramite", "sacar mi e.firma", "cambiar de regimen"
      RECOMENDACION: "Te recomendamos nuestro servicio de ayuda con el sat, que actividades realizas?"

      SI NO TIENE NADA QUE VER CON ESTO O NO SE ENCUENTRA EL SERVICIO EN LA LISTA EJECUTA LA FUNCIÓN ERROR.

      USER intent: \n
      `,
    },
    ...messages,
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages_chat,
      functions: [{
        name: "error",
        description: `
            RULES: THE USER SAY SOMETHING THAT IS NOT IN THE LIST, OR IS IRRILEVANT TO THE LIST.
            OR YOU CANT FIND THE USER INTENT. or say: "hola", "gracias", "no entendi"
            `,
        parameters: {
          type: "object",
          properties: {},
        },
      }],
      function_call: "auto",
    });

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
