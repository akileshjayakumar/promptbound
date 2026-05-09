import type { GameSnapshot, PuzzleRequest, PuzzleResult } from "@/game/types";

export const GAME_EVENTS = {
  startTrials: "promptbound:start-trials",
  snapshot: "promptbound:snapshot",
  puzzleRequest: "promptbound:puzzle-request",
  puzzleResult: "promptbound:puzzle-result",
  mentor: "promptbound:mentor",
  victory: "promptbound:victory",
} as const;

export function emitGameEvent<T>(name: string, detail: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export type SnapshotEvent = CustomEvent<GameSnapshot>;
export type PuzzleRequestEvent = CustomEvent<PuzzleRequest>;
export type PuzzleResultEvent = CustomEvent<PuzzleResult>;
