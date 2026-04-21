import { Assistant as BaseAssistant } from "./groqai";

export class Assistant extends BaseAssistant {
  constructor(model = "gemini-2.5-flash") {
    super(model, "googleai");
  }
}
