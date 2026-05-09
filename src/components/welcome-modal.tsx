"use client";

import { LEVELS } from "@/game/levels/levels";

type Props = {
  onStart: () => void;
};

export function WelcomeModal({ onStart }: Props) {
  function startTrials() {
    onStart();
  }

  return (
    <div
      className="welcome-scrim"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Promptbound"
    >
      <div className="welcome-layout">
        <header className="welcome-hero">
          <div className="welcome-title-block">
            <h1 className="welcome-title">
              PROMPT<span className="welcome-title-bound">BOUND</span>
            </h1>
            <p className="welcome-subtitle">
              play promptbound to learn ai engineering basics, one prompt at a time.
            </p>
          </div>
        </header>

        <section className="welcome-section welcome-section--levels" aria-label="Levels">
          <p className="welcome-section-label">Levels</p>
          <ol className="welcome-level-list">
            {LEVELS.map((level, index) => (
              <li key={level.id} className="welcome-level">
                <span className="welcome-level-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="welcome-level-copy">
                  <span className="welcome-level-name">{level.title}</span>
                  <span className="welcome-level-description">({level.beginnerLesson})</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div
          className="welcome-keys-strip"
          role="group"
          aria-label="Controls: arrow keys to move, jump, and strike"
        >
          <kbd className="welcome-key" title="Move">
            ←
          </kbd>
          <kbd className="welcome-key" title="Move">
            →
          </kbd>
          <kbd className="welcome-key" title="Jump">
            ↑
          </kbd>
          <kbd className="welcome-key" title="Strike">
            ↓
          </kbd>
        </div>

        <button type="button" className="welcome-cta" onClick={startTrials}>
          Start Trials
        </button>
      </div>
    </div>
  );
}
