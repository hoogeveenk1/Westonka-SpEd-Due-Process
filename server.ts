
import express from "express";
import { createServer as createViteServer } from "vite";
import { handleGenerate } from "./api/generate";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      hasKey: !!process.env.GEMINI_API_KEY 
    });
  });

  // API routes
  app.post("/api/generate", async (req, res) => {
    console.log("POST /api/generate received");
    try {
      await handleGenerate(req, res);
    } catch (error: any) {
      console.error("Unhandled Route Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
      }
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
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
