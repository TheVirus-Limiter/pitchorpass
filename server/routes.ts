import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { generatePitch, generateOutcome, answerFounderQuestion } from "./lib/openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/game/generate-pitch", async (req, res) => {
    try {
      const { phase } = req.body;
      const pitch = await generatePitch(phase);
      res.json(pitch);
    } catch (error) {
      console.error("Pitch generation error:", error);
      res.status(500).json({ message: "Failed to generate pitch" });
    }
  });

  app.post("/api/game/save-result", async (req, res) => {
    try {
      const input = api.game.saveResult.input.parse(req.body);
      const result = await storage.createGameResult(input);
      res.status(201).json(result);
    } catch (error) {
      console.error("Save result error:", error);
      res.status(500).json({ message: "Failed to save result" });
    }
  });

  // Generate outcome data for reveal sequence
  app.post("/api/game/outcome", async (req, res) => {
    try {
      const { pitch, invested, investmentAmount, equity, isWin } = req.body;
      const outcomeData = await generateOutcome(pitch, invested, investmentAmount, equity, isWin);
      res.json(outcomeData);
    } catch (error) {
      console.error("Outcome narrative error:", error);
      res.json({ 
        narrative: req.body?.isWin ? "Great success!" : "Things didn't work out.",
        newsClippings: [],
        valuationHistory: [100000, 150000, 200000, 250000, 300000, 350000],
        missedOpportunity: 0
      });
    }
  });

  // Answer founder question with AI
  app.post("/api/game/answer-question", async (req, res) => {
    try {
      const { pitch, question } = req.body;
      if (!question || !pitch) {
        return res.status(400).json({ message: "Missing pitch or question" });
      }
      const answer = await answerFounderQuestion(pitch, question);
      res.json({ answer });
    } catch (error) {
      console.error("Answer question error:", error);
      res.json({ answer: "We're focused on execution and expect strong results soon." });
    }
  });

  return httpServer;
}
