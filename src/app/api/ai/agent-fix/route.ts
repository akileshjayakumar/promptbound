import { NextRequest, NextResponse } from "next/server";
import { getLevel } from "@/game/levels/levels";
import type { LevelId } from "@/game/types";
import { EvaluationSchema } from "@/lib/ai/schemas";
import { getFixture } from "@/lib/ai/fixtures";

const DEFAULT_SCORE = 120;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const levelId = (body?.request?.levelId ?? body?.levelId) as LevelId | undefined;
  if (!levelId) {
    return NextResponse.json({ message: "No level id was provided." }, { status: 400 });
  }

  let level: ReturnType<typeof getLevel>;
  try {
    level = getLevel(levelId);
  } catch {
    return NextResponse.json({ message: "Unknown level id." }, { status: 400 });
  }

  const fixture = getFixture(level.id);
  const answer = body.answer;
  const lesson = fixture.challenge.oneLineLesson || "Try again.";

  const isCorrect = typeof answer === "string" && answer === fixture.grading.correctChoiceId;

  const result = {
    pass: isCorrect,
    score: isCorrect ? DEFAULT_SCORE : 0,
    missedCriteria: isCorrect ? [] : ["That's not quite right. Read the options carefully and try again."],
    oneLineLesson: lesson,
    correct: isCorrect,
    points: isCorrect ? DEFAULT_SCORE : 0,
    damage: isCorrect ? DEFAULT_SCORE : 0,
    badge: isCorrect ? level.reward : undefined,
    feedback: isCorrect ? lesson : "Not quite. Try a different option.",
    hint: isCorrect ? undefined : fixture.challenge.mentorLine,
  };

  const parsed = EvaluationSchema.safeParse(result);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid evaluation payload." }, { status: 500 });
  }

  return NextResponse.json(parsed.data);
}
