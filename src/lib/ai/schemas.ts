import { z } from "zod";

export const ChallengeChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const ChallengeToolSchema = ChallengeChoiceSchema.extend({
  description: z.string(),
});

export const ChallengeToolTaskSchema = ChallengeChoiceSchema.extend({
  description: z.string(),
});

const BaseChallengeSchema = z.object({
  challengeId: z.string(),
  title: z.string(),
  setup: z.string(),
  question: z.string(),
  mentorLine: z.string(),
  evaluationGuide: z.string(),
  oneLineLesson: z.string().optional(),
});

export const ChallengeSchema = z.discriminatedUnion("inputMode", [
  BaseChallengeSchema.extend({
    inputMode: z.literal("single_choice"),
    choices: z.array(ChallengeChoiceSchema).min(2).max(6),
  }),
  BaseChallengeSchema.extend({
    inputMode: z.literal("tool_select"),
    tools: z.array(ChallengeToolSchema).min(2).max(8),
    tasks: z.array(ChallengeToolTaskSchema).min(1).max(4),
  }),
]);

export const EvaluationSchema = z.object({
  pass: z.boolean(),
  score: z.number().int().min(0).max(150),
  partialCredit: z.boolean().optional(),
  missedCriteria: z.array(z.string()),
  oneLineLesson: z.string(),
  correct: z.boolean(),
  points: z.number().int().min(0).max(150),
  damage: z.number().int().min(0).max(150),
  badge: z.string().optional(),
  feedback: z.string(),
  hint: z.string().optional(),
});

export type ChallengeResponse = z.infer<typeof ChallengeSchema>;
export type EvaluationResponse = z.infer<typeof EvaluationSchema>;
export type ChallengeChoice = z.infer<typeof ChallengeChoiceSchema>;
export type ChallengeTool = z.infer<typeof ChallengeToolSchema>;
export type ChallengeToolTask = z.infer<typeof ChallengeToolTaskSchema>;
