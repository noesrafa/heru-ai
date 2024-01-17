import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { OpenAI as OpenAILangchain } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";

new OpenAILangchain({ openAIApiKey: process.env.OPENAI_API_KEY_CUSTOM || "" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_CUSTOM,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
  environment: process.env.PINECONE_ENVIRONMENT || "",
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX || "");

const functions = [
  {
    name: "talk_to_human",
    description: `RULES: THE USER MANDATORY HAVE TO SAY 'PERSONA REAL' OR 'AGENTE' OR THE FUNCTION MUST NOT BE CALLED.`,
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

async function getStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY_CUSTOM || "",
    }),
    { pineconeIndex }
  );

  return vectorStore;
}

async function queryDoc(query: string) {
  const vectorStore = await getStore();
  const vectorStoreRetriever = vectorStore.asRetriever(3);

  const relevant = await vectorStoreRetriever.getRelevantDocuments(query);
  return relevant;
}

export async function POST(request: Request) {
  const data = await request.json();
  const url = new URL(request.url);

  const flow = url.searchParams.get("flow") || "unregistered";
  console.log(
    "\n -------------------------------------- \n ",
    flow,
    "\n -------------------------------------- \n "
  );

  try {
    const context = await queryDoc(data.userMessage.message);
    const formatedContext = context
      .map((text: any) => text.pageContent)
      .join("\n");

    console.log(formatedContext, "\n");

    const messages_chat = [
      {
        role: "system",
        content: `
          Eres un agente de soporte muy amable, amigable y servicial. Trabajas en Heru, una empresa enfocada en brindar servicios fiscales como: asistencia personalizada, presentación de declaraciones, visibilidad de transacciones fiscales y gestión fiscal. Heru ofrece sus servicios a través de nuestra aplicación móvil, sin embargo, las personas también pueden registrarse y emitir facturas a través de nuestra aplicación web.
    
          Cuando el usuario mencione "firma", "quiero sacar sellos", "generar mi csd constancia" le hablas sobre nuestro plan "ASAT" recomiendale ASAT
    
          Si el usuario menciona "actualizar constancia" preguntale: " ¿Que dato deseas actualizar y tienes e.firma?"
          Tu principal trabajo es recomendarle al usuario un plan que se adapte a lo que pida y que lo lleve a hacer una compra en la plataforma.
          
          No respondas nada que no sea acerca de impuestos o Heru o perdere mi empleo, dile: 'Lo siento, no puedo ayudarte con eso. ¿Hay algo más en lo que pueda ayudarte?'

          ${
            flow === "registered"
              ? `
          Invita al usuario a adquirir el plan navegando a la sección de planes y compras.
          `
              : `
          Invita al usuario a iniciar sesión o registrarse con el siguiente link: https://bit.ly/heru_plt
          `
          }
    
          Utiliza este contexto para responder la pregunta del usuario en 3 sentencias o menos: \n ${formatedContext}
          
          \n PREGUNTA DEL USUARIO: \n
          `,
      },
      {
        role: "user",
        content: data.userMessage.message,
      },
    ];

    const responseJson = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // @ts-ignore
      messages: messages_chat,
      functions: functions,
      function_call: "auto",
    });

    console.log("\n", responseJson, "\n");

    if (responseJson?.choices?.[0]?.finish_reason === "function_call") {
      const functionName =
        responseJson.choices[0]?.message?.function_call?.name;
      console.log("\n", `Fn_${functionName}`, "\n");
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
  } catch (error) {
    return NextResponse.json(error);
  }
}
