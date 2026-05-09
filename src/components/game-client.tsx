"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WelcomeModal } from "@/components/welcome-modal";
import { GAME_EVENTS } from "@/game/lib/events";

const PhaserGame = dynamic(() => import("@/components/phaser-game").then((mod) => mod.PhaserGame), {
  ssr: false,
  loading: () => (
    <div className="game-loading">
      <div className="pixel-loader" />
      <p>Booting Promptbound...</p>
    </div>
  ),
});

export function GameClient() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const preventEscapeDismissal = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("keydown", preventEscapeDismissal, { capture: true });
    window.addEventListener("keyup", preventEscapeDismissal, { capture: true });
    return () => {
      window.removeEventListener("keydown", preventEscapeDismissal, { capture: true });
      window.removeEventListener("keyup", preventEscapeDismissal, { capture: true });
    };
  }, []);

  function startTrials() {
    setStarted(true);
    window.dispatchEvent(new CustomEvent(GAME_EVENTS.startTrials));
  }

  return (
    <>
      <PhaserGame startRequested={started} />
      {!started && <WelcomeModal onStart={startTrials} />}
    </>
  );
}
