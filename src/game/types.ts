export type LevelId =
  | "prompt-gate"
  | "token-mine"
  | "retrieval-library"
  | "toolbelt-trial"
  | "agent-citadel";

export type InputMode = "single_choice" | "tool_select";

export type PuzzleKind =
  | "prompting"
  | "context"
  | "retrieval"
  | "tool-calling"
  | "agents";

export type PuzzleChoice = {
  id: string;
  label: string;
};

export type ToolOption = PuzzleChoice & {
  description: string;
};

export type LevelChallengeBlueprint = {
  beginnerFraming: string;
  successCriteria: string;
  sampleGoodAnswer: string;
  commonMistakeExample: string;
};

export type LevelDefinition = {
  id: LevelId;
  level: number;
  title: string;
  concept: string;
  beginnerLesson: string;
  objective: string;
  reward: string;
  enemyName: string;
  enemyLesson: string;
  introBeat: string;
  enemyTaunt: string;
  trialSetup: string;
  clearBeat: string;
  tutorialHint?: string;
  puzzleKind: PuzzleKind;
  challengeBlueprint: LevelChallengeBlueprint;
  palette: {
    sky: number;
    far: number;
    mid: number;
    platform: number;
    trim: number;
    accent: number;
    enemy: number;
  };
};

export type GameSnapshot = {
  levelId: LevelId;
  level: number;
  title: string;
  concept: string;
  objective: string;
  enemyName: string;
  enemyShield: number;
  enemyHp: number;
  playerHp: number;
  score: number;
  insight: number;
  exitUnlocked: boolean;
  badges: string[];
  mentorLine: string;
};

export type PuzzleRequest = {
  levelId: LevelId;
  title: string;
  concept: string;
  objective: string;
  enemyName: string;
  enemyLesson: string;
  introBeat: string;
  enemyTaunt: string;
  trialSetup: string;
  puzzleKind: PuzzleKind;
  score: number;
  beginnerLesson: string;
  reward: string;
};

export type PuzzleResult = {
  correct: boolean;
  points: number;
  damage: number;
  badge?: string;
  feedback: string;
  hint?: string;
  pass?: boolean;
  score?: number;
  partialCredit?: boolean;
  missedCriteria?: string[];
  oneLineLesson?: string;
};
