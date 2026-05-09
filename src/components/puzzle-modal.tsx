"use client";

import {
  CloudSun,
  Contact,
  Image,
  MailPlus,
  Search,
  SquareCode,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { GAME_EVENTS } from "@/game/lib/events";
import type { PuzzleRequest, PuzzleResult } from "@/game/types";
import type { ChallengeResponse } from "@/lib/ai/schemas";

type Challenge = ChallengeResponse;

const TOOL_ICONS: Record<string, LucideIcon> = {
  "contact-lookup": Contact,
  "message-draft": MailPlus,
  "image-generator": Image,
  "code-runner": SquareCode,
  "weather-search": CloudSun,
  "random-web-search": Search,
};

type EvalResponse = PuzzleResult & {
  oneLineLesson?: string;
};

type Props = {
  request: PuzzleRequest;
  onSolved: () => void;
};

export function PuzzleModal({ request, onSolved }: Props) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedToolsByTask, setSelectedToolsByTask] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<EvalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solved = Boolean(feedback?.correct || feedback?.pass);
  const hasAnswer =
    challenge?.inputMode === "tool_select"
      ? challenge.tasks.every((task) => Boolean(selectedToolsByTask[task.id]))
      : Boolean(selectedChoice);
  const canSubmit = Boolean(challenge && hasAnswer && !submitting && !solved);

  const endpoint =
    request.levelId === "agent-citadel" ? "/api/ai/agent-fix" : "/api/ai/evaluate";

  useEffect(() => {
    let cancelled = false;

    async function loadChallenge() {
      setLoading(true);
      setError(null);
      setFeedback(null);
      setSelectedChoice("");
      setSelectedToolsByTask({});
      try {
        const response = await fetch("/api/ai/challenge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(request),
        });

        const json = (await response.json()) as Challenge & { message?: string };
        if (!response.ok) {
          throw new Error(json.message ?? "The trial engine cannot respond right now.");
        }

        if (!cancelled) {
          setChallenge(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "The trial engine cannot respond right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadChallenge();
    return () => {
      cancelled = true;
    };
  }, [request]);

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || !canSubmit || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          request,
          challenge,
          answer: challenge.inputMode === "tool_select" ? selectedToolsByTask : selectedChoice,
        }),
      });

      const json = (await response.json()) as EvalResponse & { message?: string };
      if (!response.ok) {
        throw new Error(json.message ?? "The trial engine could not judge that attempt.");
      }

      setFeedback(json);
      window.dispatchEvent(new CustomEvent(GAME_EVENTS.puzzleResult, { detail: json }));

      if (json.correct || json.pass) {
        window.setTimeout(onSolved, 900);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The trial engine could not judge that attempt.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="puzzle-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={`${request.title} challenge`}
      data-level-id={request.levelId}
      data-puzzle-kind={request.puzzleKind}
    >
      <div className="puzzle-panel">
        <div className="puzzle-header">
          <div>
            <p className="eyebrow">Gate Trial</p>
            <h2>{request.title}</h2>
          </div>
          <span className="concept-badge">{request.concept}</span>
        </div>

        {loading ? (
          <div className="modal-state">
            <div className="pixel-loader" />
            <p>Preparing a fresh trial...</p>
          </div>
        ) : error ? (
          <div className="modal-state error">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Retry stage
            </button>
          </div>
        ) : challenge ? (
          <form className="challenge-form" onSubmit={submitAnswer}>
            <div className="trial-directive mentor-card">
              <p>{request.beginnerLesson || challenge.mentorLine}</p>
            </div>

            <div className="trial-briefing challenge-copy">
              <p>{challenge.setup}</p>
              <h3>{challenge.question}</h3>
            </div>

            <div className="trial-response">
              {challenge.inputMode === "tool_select" ? (
                <div className="tool-task-grid">
                  {challenge.tasks.map((task) => (
                    <section className="tool-task" key={task.id} aria-labelledby={`${task.id}-label`}>
                      <div className="tool-task-copy">
                        <h4 id={`${task.id}-label`}>{task.label}</h4>
                        <p>{task.description}</p>
                      </div>

                      <div
                        className="tool-option-grid"
                        role="radiogroup"
                        aria-label={`Choose one tool for ${task.label}`}
                      >
                        {challenge.tools.map((tool) => {
                          const Icon = TOOL_ICONS[tool.id] ?? Search;
                          const isSelected = selectedToolsByTask[task.id] === tool.id;
                          let toolClass = "tool-option";
                          if (isSelected) toolClass += " selected";
                          if (feedback && isSelected) {
                            toolClass += solved ? " correct-pick" : " wrong-pick";
                          }

                          return (
                            <button
                              type="button"
                              key={`${task.id}-${tool.id}`}
                              className={toolClass}
                              onClick={() => {
                                if (solved) return;
                                setSelectedToolsByTask((current) => ({
                                  ...current,
                                  [task.id]: tool.id,
                                }));
                              }}
                              role="radio"
                              aria-checked={isSelected}
                              title={tool.description}
                              disabled={solved}
                            >
                              <Icon size={18} strokeWidth={2.4} aria-hidden />
                              <span>{tool.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="choice-grid" role="radiogroup" aria-label="Choose one answer">
                  {challenge.choices.map((choice) => {
                    const isSelected = selectedChoice === choice.id;
                    let choiceClass = "choice";
                    if (isSelected) choiceClass += " selected";
                    if (feedback && isSelected) {
                      choiceClass += solved ? " correct-pick" : " wrong-pick";
                    }

                    return (
                      <button
                        type="button"
                        key={choice.id}
                        className={choiceClass}
                        onClick={() => {
                          if (!solved) setSelectedChoice(choice.id);
                        }}
                        role="radio"
                        aria-checked={isSelected}
                        disabled={solved}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {feedback && (
              <div className={solved ? "feedback good" : "feedback"}>
                <strong>{solved ? "Trial passed" : "Try again"}</strong>
                <p>{feedback.oneLineLesson ?? feedback.feedback}</p>
              </div>
            )}

            <div className="puzzle-actions">
              <span>Reward: {request.reward}</span>
              <button type="submit" disabled={!canSubmit}>
                {submitting ? "Checking..." : "Submit"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
