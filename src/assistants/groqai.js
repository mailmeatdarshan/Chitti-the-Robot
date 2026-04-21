export class Assistant {
  #model;
  #provider;

  constructor(model = "meta-llama/llama-4-scout-17b-16e-instruct", provider = "groqai") {
    this.#model = model;
    this.#provider = provider;
  }

  async chat(content, history) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: this.#provider,
          model: this.#model,
          content,
          history,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch from API");
      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: this.#provider,
          model: this.#model,
          content,
          history,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch from API");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    } catch (error) {
      throw error;
    }
  }
}
