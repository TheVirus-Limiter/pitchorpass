import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { generatePitch, generateOutcome } from "./lib/openai";
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
      res.status(500).json({ message: "Failed to generate pitch" });
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

  // Generate outcome narrative for reveal sequence
  app.post("/api/game/outcome", async (req, res) => {
    try {
      const { pitch, invested, outcome, isWin } = req.body;
      const narrative = await generateOutcome(pitch, invested, outcome, isWin);
      res.json({ narrative });
    } catch (error) {
      console.error("Outcome narrative error:", error);
      res.json({ narrative: isWin ? "Great success!" : "Things didn't work out." });
    }
  });

  return httpServer;
}
