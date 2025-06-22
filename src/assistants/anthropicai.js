// import Anthropic from "@anthropic-ai/sdk";

// const anthropic = new Anthropic({
//   apiKey: import.meta.env.VITE_ANTHROPIC_AI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export class Assistant {
//   #client;
//   #model;

//   constructor(model = "claude-3-5-haiku-latest", client = anthropic) {
//     this.#client = client;
//     this.#model = model;
//   }

//   async chat(content, history) {
//     try {
//       const result = await this.#client.messages.create({
//         model: this.#model,
//         messages: [...history, { content, role: "user" }],
//         max_tokens: 1024,
//       });

//       return result.content[0].text;
//     } catch (error) {
//       throw this.#parseError(error);
//     }
//   }

//   async *chatStream(content, history) {
//     try {
//       const result = await this.#client.messages.create({
//         model: this.#model,
//         messages: [...history, { content, role: "user" }],
//         max_tokens: 1024,
//         stream: true,
//       });

//       for await (const chunk of result) {
//         if (chunk.type === "content_block_delta") {
//           yield chunk.delta.text || "";
//         }
//       }
//     } catch (error) {
//       throw this.#parseError(error);
//     }
//   }

//   #parseError(error) {
//     try {
//       return error.error.error;
//     } catch (parseError) {
//       return error;
//     }
//   }
// }

import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
});

export class Assistant {
  #chat;

  constructor(model = "gemini-1.5-flash") {
    this.#chat = googleai.chats.create({ model });
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  async *chatStream(content) {
    try {
      const result = await this.#chat.sendMessageStream({ message: content });

      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  #parseError(error) {
    try {
      // Extract and parse the outer error JSON from the message string
      const [, outerErrorJSON] = error?.message?.split(" . ");
      const outerErrorObject = JSON.parse(outerErrorJSON);

      // Parse the nested stringified JSON from the outer error
      const innerErrorObject = JSON.parse(outerErrorObject?.error?.message);

      return innerErrorObject?.error;
    } catch (parseError) {
      return error;
    }
  }
}