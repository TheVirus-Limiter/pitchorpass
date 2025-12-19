import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull(), // Final capital
  archetype: text("archetype").notNull(), // "The Visionary", etc.
  details: jsonb("details").notNull(), // Store summary of wins/losses for sharing
  createdAt: text("created_at").notNull(),
});

export const insertGameSchema = createInsertSchema(games).omit({ id: true });

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

// === Game Data Types (Not DB tables, but shared API types) ===

export const founderSchema = z.object({
  name: z.string(),
  photo: z.string(),
  country: z.string(),
});

export const startupSchema = z.object({
  name: z.string(),
  pitch: z.string(),
  market: z.string(),
  traction: z.object({
    users: z.number(),
    monthlyGrowth: z.number(),
    revenue: z.number(),
  }),
  risk: z.number(),   // 0-1, hidden from player in UI but sent to client for game logic
  upside: z.number(), // multiplier, hidden from player in UI
});

export const pitchSchema = z.object({
  founder: founderSchema,
  startup: startupSchema,
  ask: z.number(),
});

export type Pitch = z.infer<typeof pitchSchema>;
