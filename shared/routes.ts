import { z } from "zod";
import { pitchSchema, insertGameSchema, games } from "./schema";

export const api = {
  game: {
    generatePitch: {
      method: "POST" as const,
      path: "/api/game/pitch",
      responses: {
        200: pitchSchema,
        500: z.object({ message: z.string() }),
      },
    },
    saveResult: {
      method: "POST" as const,
      path: "/api/game/result",
      input: insertGameSchema,
      responses: {
        201: z.custom<typeof games.$inferSelect>(),
        500: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
