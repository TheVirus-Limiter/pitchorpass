import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { generatePitch } from "./lib/openai";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.game.generatePitch.path, async (req, res) => {
    try {
      const pitch = await generatePitch();
      res.json(pitch);
    } catch (error) {
      console.error("Pitch generation error:", error);
      // Fallback pitch if AI fails
      res.json({
        founder: {
          name: "Alex Rivera",
          country: "United States",
          photo: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        startup: {
          name: "Fallback Tech",
          pitch: "We are revolutionizing the way you handle API errors by providing a fallback mechanism. It's not flashy, but it works.",
          market: "DevTools",
          traction: { users: 1000, monthlyGrowth: 5, revenue: 500 },
          risk: 0.2,
          upside: 2
        },
        ask: 1000000
      });
    }
  });

  app.post(api.game.saveResult.path, async (req, res) => {
    try {
      const input = api.game.saveResult.input.parse(req.body);
      const result = await storage.createGameResult(input);
      res.status(201).json(result);
    } catch (error) {
      console.error("Save result error:", error);
      res.status(500).json({ message: "Failed to save result" });
    }
  });

  return httpServer;
}
