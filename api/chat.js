import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { provider, content, history, model } = await req.json();

    if (provider === "googleai") {
      return await handleGoogleAI(content, history, model);
    } else if (provider === "openai") {
      return await handleOpenAI(content, history, model);
    } else if (provider === "groqai") {
      return await handleGroqAI(content, history, model);
    }

    return new Response("Invalid Provider", { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleGoogleAI(content, history, modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
  
  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  const result = await chat.sendMessageStream(content);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return new Response(stream);
}

async function handleOpenAI(content, history, modelName) {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: modelName || "gpt-5.4-mini",
    messages: [...history, { content, role: "user" }],
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream);
}

async function handleGroqAI(content, history, modelName) {
  const groq = new OpenAI({
    apiKey: process.env.GROQ_AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await groq.chat.completions.create({
    model: modelName || "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [...history, { content, role: "user" }],
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream);
}
