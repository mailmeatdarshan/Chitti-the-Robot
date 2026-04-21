import { Assistant as GroqAIAssistant } from "./groqai";

export class Assistant extends GroqAIAssistant {
  constructor(model = "meta-llama/llama-4-scout-17b-16e-instruct") {
    super(model);
  }
}
