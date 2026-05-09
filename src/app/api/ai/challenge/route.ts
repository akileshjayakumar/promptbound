import { NextRequest, NextResponse } from "next/server";
import { getLevel } from "@/game/levels/levels";
import type { LevelId } from "@/game/types";
import { ChallengeSchema } from "@/lib/ai/schemas";
import { getFixture } from "@/lib/ai/fixtures";

// DEMO MODE: hard-coded fixtures + rule-based evaluation. Swap to LLM post-hackathon.

export async function POST(request: NextRequest) {
  const body = await request.json();
  const levelId = (body?.request?.levelId ?? body?.levelId) as LevelId | undefined;
  if (!levelId) {
    return NextResponse.json({ error: "missing_level_id", message: "No level id was provided." }, { status: 400 });
  }

  let level: ReturnType<typeof getLevel>;
  try {
    level = getLevel(levelId);
  } catch {
    return NextResponse.json({ error: "invalid_level_id", message: "Unknown level id." }, { status: 400 });
  }

  const fixture = getFixture(level.id);
  const parsed = ChallengeSchema.safeParse(fixture.challenge);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_fixture", message: "The demo puzzle fixture is missing required fields." },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed.data);
}
