import { Assistant as BaseAssistant } from "./groqai";

export class Assistant extends BaseAssistant {
  constructor(model = "gpt-5.4-mini") {
    super(model, "openai");
  }
}
