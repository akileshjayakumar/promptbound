"use client";

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { PuzzleModal } from "@/components/puzzle-modal";
import { GAME_EVENTS } from "@/game/lib/events";
import type { GameSnapshot, PuzzleRequest } from "@/game/types";

const TOTAL_LEVELS = 5;

const initialSnapshot: GameSnapshot = {
  levelId: "prompt-gate",
  level: 1,
  title: "The Prompt Gate",
  concept: "Prompting",
  objective: "Visit the Vague Warden, then answer its prompt challenge.",
  enemyName: "Vague Warden",
  enemyShield: 100,
  enemyHp: 100,
  playerHp: 100,
  score: 0,
  insight: 0,
  exitUnlocked: false,
  badges: [],
  mentorLine: "Reach the gate. Ask the Warden for the trial.",
};

function LevelHud({ snapshot }: { snapshot: GameSnapshot }) {
  return (
    <div className="level-hud" aria-label={`Level ${snapshot.level} of ${TOTAL_LEVELS}`}>
      <div className="level-hud-text">
        <span className="level-hud-number">Level {snapshot.level}/{TOTAL_LEVELS}</span>
        <span className="level-hud-title">{snapshot.title}</span>
      </div>
      <div className="level-hud-pips" aria-hidden>
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
          const n = i + 1;
          let cls = "level-pip";
          if (n < snapshot.level) cls += " completed";
          else if (n === snapshot.level) cls += " active";
          return <span key={n} className={cls} />;
        })}
      </div>
    </div>
  );
}

type Props = {
  startRequested: boolean;
};

export function PhaserGame({ startRequested }: Props) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const startRequestedRef = useRef(startRequested);
  const startEventDeliveredRef = useRef(false);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(initialSnapshot);
  const [puzzle, setPuzzle] = useState<PuzzleRequest | null>(null);
  const [victory, setVictory] = useState<{ score: number; badges: string[] } | null>(null);

  useEffect(() => {
    startRequestedRef.current = startRequested;
    if (!startRequested) {
      startEventDeliveredRef.current = false;
      return;
    }
    if (startRequested) {
      window.dispatchEvent(new CustomEvent(GAME_EVENTS.startTrials));
    }
  }, [startRequested]);

  useEffect(() => {
    let disposed = false;

    async function boot() {
      const [{ createGameConfig }] = await Promise.all([import("@/game/config")]);
      if (disposed || gameRef.current) {
        return;
      }
      gameRef.current = new Phaser.Game(createGameConfig("promptbound-game"));
    }

    boot();

    const onSnapshot = (event: Event) => {
      setSnapshot((event as CustomEvent<GameSnapshot>).detail);
      if (startRequestedRef.current && !startEventDeliveredRef.current) {
        startEventDeliveredRef.current = true;
        window.dispatchEvent(new CustomEvent(GAME_EVENTS.startTrials));
      }
    };
    const onPuzzle = (event: Event) => {
      setPuzzle((event as CustomEvent<PuzzleRequest>).detail);
    };
    const onMentor = (event: Event) => {
      const message = (event as CustomEvent<{ message: string }>).detail.message;
      setSnapshot((current) => ({ ...current, mentorLine: message }));
    };
    const onVictory = (event: Event) => {
      setVictory((event as CustomEvent<{ score: number; badges: string[] }>).detail);
    };

    window.addEventListener(GAME_EVENTS.snapshot, onSnapshot);
    window.addEventListener(GAME_EVENTS.puzzleRequest, onPuzzle);
    window.addEventListener(GAME_EVENTS.mentor, onMentor);
    window.addEventListener(GAME_EVENTS.victory, onVictory);

    return () => {
      disposed = true;
      window.removeEventListener(GAME_EVENTS.snapshot, onSnapshot);
      window.removeEventListener(GAME_EVENTS.puzzleRequest, onPuzzle);
      window.removeEventListener(GAME_EVENTS.mentor, onMentor);
      window.removeEventListener(GAME_EVENTS.victory, onVictory);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  function restart() {
    setVictory(null);
    setPuzzle(null);
    gameRef.current?.scene.start("LevelScene", { levelId: "prompt-gate", score: 0, badges: [] });
  }

  return (
    <section className="game-shell" aria-label="Promptbound game">
      <div className="game-frame">
        <div id="promptbound-game" className="game-canvas" />
        <LevelHud snapshot={snapshot} />
        <p className="sr-only" aria-live="polite">
          {snapshot.title}. {snapshot.objective} {snapshot.mentorLine}
        </p>
      </div>

      {puzzle && <PuzzleModal request={puzzle} onSolved={() => setPuzzle(null)} />}

      {victory && (
        <div className="puzzle-scrim" role="dialog" aria-modal="true" aria-label="Victory">
          <div className="victory-panel">
            <p className="eyebrow">Final clear</p>
            <h2>Five Trials Complete</h2>
            <p>
              You escaped the dungeon with {victory.score} Insight Points and proved the loop:
              prompt, choose context, retrieve evidence, call the right tools, then orchestrate agents.
            </p>
            <div className="victory-badges">
              {victory.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
            <button type="button" onClick={restart}>
              Run again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
