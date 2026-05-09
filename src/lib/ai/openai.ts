import crypto from "node:crypto";
import OpenAI from "openai";
import type { NextRequest } from "next/server";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

export function getTextModel() {
  return process.env.OPENAI_TEXT_MODEL ?? "gpt-5.4-nano";
}

export function getReasoningEffort() {
  const model = getTextModel();
  if (model.includes("nano")) {
    return "none" as const;
  }
  return "low" as const;
}

export function getSafetyIdentifier(request: NextRequest) {
  const raw =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("user-agent") ??
    "local-player";
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function offlineResponse() {
  return {
    error: "mentor_offline",
    message:
      "The trial engine cannot reach OpenAI yet. Add OPENAI_API_KEY to your environment, then retry the stage.",
  };
}
