import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "You are an intelligent, helpful AI assistant named Gemini. Provide thorough and helpful answers. If the user asks complex questions, break them down clearly.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        },
      });

      // Send existing history if we want context, but let's just replay or send the latest user prompt + history.
      // @google/genai requires `chat.sendMessageStream` with a single message, but how to set history?
      // For ai.models.generateContentStream, it accepts an array of content parts.
      // Actually, `@google/genai` `ai.chats.create` config accepts `history`.
      // Let's manually map the client messages to history format.
      // Or simply use generateContentStream with an array of objects.
      
      // We will do generateContentStream to have full control of history.
      const contents = messages.map((m: any) => ({
        role: m.role, // 'user' or 'model'
        parts: [{ text: m.content }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          systemInstruction: "You are an intelligent, helpful AI assistant. Provide thorough and helpful answers.",
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.end();
    } catch (error: any) {
      console.error('Gemini error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
