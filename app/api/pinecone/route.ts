import { NextResponse } from "next/server";

import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY_CUSTOM || "" });

// CONFIG PINECONE
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
  environment: process.env.PINECONE_ENVIRONMENT || "",
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX || "");

// GET STORE
async function getStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY_CUSTOM || "",
    }),
    { pineconeIndex }
  );

  return vectorStore;
}

// UPLOAD DOCS
async function uploadDocs() {
  const text = fs.readFileSync("./document.txt", {
    encoding: "utf8",
    flag: "r",
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const chunks = await textSplitter.createDocuments([text]);
  await PineconeStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
    pineconeIndex,
    //@ts-ignore
    maxConcurrency: 5, // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  });
}

// DELETE DOCS
async function deleteDocs() {
  const vectorStore = await getStore();
  vectorStore.delete({ deleteAll: true });

  console.log("✅ Deleted all documents");
}

// QUERY DOC
async function queryDoc(query: string) {
  const vectorStore = await getStore();
  const vectorStoreRetriever = vectorStore.asRetriever(3);

  const relevant = await vectorStoreRetriever.getRelevantDocuments(query);
  return relevant;
}

// -------------------------- QUERY AND SEND DOCS --------------------------

export async function POST(request: Request) {
  const { query, sendDocs } = await request.json();

  // ========= TEST =========
  // if (query) {
  //   const results = await queryDoc(query);
  //   return NextResponse.json({ message: results });
  // }
  // ========================

  if (sendDocs) {
    await deleteDocs();
    await uploadDocs();

    return NextResponse.json("Creados");
  }

  try {
    const results = await queryDoc(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(error);
  }
}

// -------------------------- DELETE DOCS ----------------------------------

export async function DELETE() {
  await deleteDocs();

  return NextResponse.json("Deleted");
}
