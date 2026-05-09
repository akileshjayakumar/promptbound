import type { LevelDefinition, LevelId } from "@/game/types";

export const LEVELS: LevelDefinition[] = [
  {
    id: "prompt-gate",
    level: 1,
    title: "The Prompt Gate",
    concept: "Prompting",
    beginnerLesson: "Learn to write a prompt for coding agents.",
    objective: "Visit the Vague Warden and answer its prompt challenge.",
    reward: "Prompt Badge",
    enemyName: "Vague Warden",
    enemyLesson: "It reveals how fuzzy instructions produce fuzzy results. Meet it by making the task specific.",
    introBeat:
      "The first gate listens only to clear intent. If your command is vague, the Warden fills the blanks for you.",
    enemyTaunt:
      "Before this gate opens, show me where the blurry request becomes clear.",
    trialSetup:
      "The Warden invites you to turn a vague request into a useful prompt.",
    clearBeat:
      "The gate understands you now. Clear goals make the path visible.",
    tutorialHint:
      "Move with ←/→, jump with ↑, and press ↓ near the Warden to strike and begin its prompt challenge.",
    challengeBlueprint: {
      beginnerFraming:
        "The Gate only opens for clear instructions. Tell the robot cook exactly what feast to prepare.",
      successCriteria:
        "Correct if the prompt states what to cook, for whom or a constraint, and the output format.",
      sampleGoodAnswer:
        "Give me a 15-minute vegetarian dinner for 2 people, as a numbered step list with a shopping list.",
      commonMistakeExample:
        "Make me a healthy dinner please.",
    },
    puzzleKind: "prompting",
    palette: {
      sky: 0xaeddf2,
      far: 0x81b8d7,
      mid: 0x5f8f66,
      platform: 0x8b5f3d,
      trim: 0xf0c56a,
      accent: 0xffd166,
      enemy: 0xe99057,
    },
  },
  {
    id: "token-mine",
    level: 2,
    title: "The Token Mine",
    concept: "Context",
    beginnerLesson: "Learn to choose only the context needed for the answer.",
    objective: "Pick only the useful scrolls, skip the noise.",
    reward: "Context Crystal",
    enemyName: "Context Crusher",
    enemyLesson: "It buries the useful clue under irrelevant details. Beat it by selecting the right context.",
    introBeat:
      "Past the gate, the mine is packed with shiny facts. Only a few actually help the model answer.",
    enemyTaunt:
      "Take every crystal. More words must mean more wisdom, right?",
    trialSetup:
      "The Crusher mixes useful context with noise. Choose only what the model needs.",
    clearBeat:
      "The model's context bag is lighter, cleaner, and finally useful.",
    tutorialHint: "Collect insight shards. Useful context matters more than a full bag.",
    challengeBlueprint: {
      beginnerFraming:
        "Your apprentice's satchel is full. Pick only the scrolls needed to answer: When does the festival start?",
      successCriteria:
        "Correct if you pick the time-bearing scroll, avoid irrelevant details, and keep selection lean.",
      sampleGoodAnswer: "Festival invite + town square address",
      commonMistakeExample:
        "Selecting every scroll because more options feel safer.",
    },
    puzzleKind: "context",
    palette: {
      sky: 0xc5e7ee,
      far: 0x9ab0c6,
      mid: 0x6c8960,
      platform: 0x8b6a45,
      trim: 0xf1b95a,
      accent: 0xf6d365,
      enemy: 0x92b35b,
    },
  },
  {
    id: "retrieval-library",
    level: 3,
    title: "The Retrieval Library",
    concept: "Retrieval",
    beginnerLesson: "Learn to answer from sources and flag missing information.",
    objective: "Mark missing details, then answer from citations only.",
    reward: "Retrieval Compass",
    enemyName: "Source Thief",
    enemyLesson:
      "It hides reliable evidence among rumours. Beat it by grounding answers in a source.",
    introBeat:
      "The library keeps the right answer in one reliable scroll, but rumours have learned to shelve themselves nearby.",
    enemyTaunt:
      "Why read the source when a confident rumour sounds faster?",
    trialSetup:
      "The Thief forces you to pick a source first, then answer from that source only.",
    clearBeat:
      "The compass points to evidence before answer. That is how retrieval stays honest.",
    tutorialHint: "When cards appear, pick the source that directly supports the answer.",
    challengeBlueprint: {
      beginnerFraming:
        "Three ancient tomes are open. Answer using only what the pages say. If they don't say it, mark not in source.",
      successCriteria:
        "Correct if you mark height as not in source, do not invent a height number, and cite a page or toggle not in source.",
      sampleGoodAnswer:
        "Pages mention steps and beacon range, but not height. It is not in the source.",
      commonMistakeExample:
        "Estimating height from the number of steps or beacon distance.",
    },
    puzzleKind: "retrieval",
    palette: {
      sky: 0xc9d6f0,
      far: 0x8c90c7,
      mid: 0x6e8d60,
      platform: 0x7a5940,
      trim: 0xd8b35a,
      accent: 0x9bd7e8,
      enemy: 0xb989d6,
    },
  },
  {
    id: "toolbelt-trial",
    level: 4,
    title: "The Toolbelt Trial",
    concept: "Tool Calling",
    beginnerLesson: "Learn to choose the right tools before asking an AI to act.",
    objective: "Equip only the tools needed to find the helper and prepare the reminder.",
    reward: "Toolbelt Badge",
    enemyName: "Locked Toolsmith",
    enemyLesson:
      "It locks away every tool until you can name which ones actually help the task.",
    introBeat:
      "Beyond the library, the workshop hums with tools. Some extend the AI's reach. Some only add noise.",
    enemyTaunt:
      "Take every tool. A bigger belt must mean a better agent, right?",
    trialSetup:
      "The Toolsmith asks you to equip a small, useful toolbelt for a contact-and-reminder mission.",
    clearBeat:
      "The right tools click into place. The AI can now act with purpose instead of guessing.",
    tutorialHint: "When the toolbelt opens, choose exactly one tool for each task.",
    challengeBlueprint: {
      beginnerFraming:
        "A workshop lead needs a reminder sent to the right helper, but the AI starts with no contact details.",
      successCriteria:
        "Correct if Find the right helper uses Contact Lookup and Prepare the reminder uses Message Draft.",
      sampleGoodAnswer: "Find the right helper: Contact Lookup. Prepare the reminder: Message Draft.",
      commonMistakeExample:
        "Selecting a bundle of tools without matching each tool to a specific task.",
    },
    puzzleKind: "tool-calling",
    palette: {
      sky: 0xd5cdf1,
      far: 0x9b89bf,
      mid: 0x6f8b76,
      platform: 0x7c6245,
      trim: 0xffd98a,
      accent: 0xd8b4fe,
      enemy: 0x9b8be8,
    },
  },
  {
    id: "agent-citadel",
    level: 5,
    title: "The Agent Citadel",
    concept: "Agents",
    beginnerLesson: "Learn to guide an agent through plan, fix, test, review, and explain.",
    objective: "Repair the snack dispenser by following all five steps.",
    reward: "Agent Core",
    enemyName: "Broken Core",
    enemyLesson:
      "It fails when work happens without planning or tests. Beat it by orchestrating agents.",
    introBeat:
      "At the citadel, the dungeon core is not evil. It is broken work: changes without plans, tests, or review.",
    enemyTaunt:
      "Patch first. Explain never. Surely nothing will snap.",
    trialSetup:
      "The Core needs a safe agent workflow: plan the fix, make it, test it, then explain it.",
    clearBeat:
      "The core stabilizes because the work has a loop, not just a guess.",
    tutorialHint: "The final answer needs the whole workflow, not only a code-looking fix.",
    challengeBlueprint: {
      beginnerFraming:
        "The Citadel's enchanted snack dispenser is broken. Guide the agent through plan, fix, test, review and explain.",
      successCriteria:
        "Correct if all five workflow steps are present and each one is sound.",
      sampleGoodAnswer:
        "Plan: check power, sensor, then dispenser motor. Fix: reseat motor wiring. Test: insert coin and confirm snack drops. Review: motor could still be burnt. Explain: I checked power and the motor path, then verified with a test coin.",
      commonMistakeExample:
        "Skipping the test step and saying it should be fixed now.",
    },
    puzzleKind: "agents",
    palette: {
      sky: 0xbbe0f1,
      far: 0x7da6ca,
      mid: 0x5f9470,
      platform: 0x7d5a3d,
      trim: 0xf4c56d,
      accent: 0x8bd6e8,
      enemy: 0xd97b6b,
    },
  },
];

export function getLevel(id: LevelId) {
  const level = LEVELS.find((item) => item.id === id);
  if (!level) {
    throw new Error(`Unknown level: ${id}`);
  }
  return level;
}

export function getNextLevel(id: LevelId) {
  const index = LEVELS.findIndex((item) => item.id === id);
  return LEVELS[index + 1] ?? null;
}
