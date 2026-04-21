import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { provider, content, history, model } = req.body;

    if (provider === "googleai" && !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is missing on Vercel");
    }
    if (provider === "openai" && !process.env.OPEN_AI_API_KEY) {
      throw new Error("OPEN_AI_API_KEY is missing on Vercel");
    }
    if (provider === "groqai" && !process.env.GROQ_AI_API_KEY) {
      throw new Error("GROQ_AI_API_KEY is missing on Vercel");
    }

    if (provider === "googleai") {
      return await handleGoogleAI(content, history, model, res);
    } else if (provider === "openai") {
      return await handleOpenAI(content, history, model, res);
    } else if (provider === "groqai") {
      return await handleGroqAI(content, history, model, res);
    }

    return res.status(400).json({ error: "Invalid Provider" });
  } catch (error) {
    console.error("API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGoogleAI(content, history, modelName, res) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash" });
  
  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  const result = await chat.sendMessageStream(content);
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  for await (const chunk of result.stream) {
    res.write(chunk.text());
  }
  res.end();
}

async function handleOpenAI(content, history, modelName, res) {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: modelName || "gpt-5.4-mini",
    messages: [...history, { content, role: "user" }],
    stream: true,
  });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }
  res.end();
}

async function handleGroqAI(content, history, modelName, res) {
  const groq = new OpenAI({
    apiKey: process.env.GROQ_AI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const stream = await groq.chat.completions.create({
    model: modelName || "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [...history, { content, role: "user" }],
    stream: true,
  });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }
  res.end();
}
