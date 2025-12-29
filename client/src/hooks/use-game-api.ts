import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Pitch, type InsertGame } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useGeneratePitch() {
  return useMutation({
    mutationFn: async (phase: number = 1) => {
      const res = await apiRequest(
        "POST",
        "/api/game/generate-pitch",
        { phase }
      );
      const data = await res.json();
      return api.game.generatePitch.responses[200].parse(data);
    },
  });
}

export function useSaveResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gameData: InsertGame) => {
      const res = await apiRequest(
        api.game.saveResult.method,
        api.game.saveResult.path,
        gameData
      );
      const data = await res.json();
      return api.game.saveResult.responses[201].parse(data);
    },
    // We don't really have a list query to invalidate yet, but good practice
    onSuccess: () => {
      // Could invalidate leaderboards here
    }
  });
}
