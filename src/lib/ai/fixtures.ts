import type { LevelId } from "@/game/types";
import type { ChallengeResponse } from "@/lib/ai/schemas";

type LevelFixture = {
  id: LevelId;
  challenge: ChallengeResponse;
  grading: {
    correctChoiceId?: string;
    correctToolSelections?: Record<string, string>;
    fullScore: number;
  };
};

export const PROMPTBOUND_FIXTURES: Record<LevelId, LevelFixture> = {
  "prompt-gate": {
    id: "prompt-gate",
    challenge: {
      challengeId: "prompt-gate",
      title: "The Prompt Gate",
      setup:
        "The Gate only opens for clear instructions. A robot cook awaits your order, but vague requests confuse it.",
      question: "Which prompt would give the robot cook the clearest instructions?",
      inputMode: "single_choice",
      choices: [
        { id: "a", label: "Make me something healthy." },
        { id: "b", label: "Cook food please." },
        { id: "c", label: "Give me a 15-minute vegetarian dinner for 2, as a numbered step list with a shopping list." },
        { id: "d", label: "I'm hungry, surprise me with dinner." },
      ],
      mentorLine: "A clear prompt states what, for whom, and the output format.",
      evaluationGuide: "The correct answer specifies a dish, audience, and format.",
      oneLineLesson: "Clear prompts say what, for whom, and what format.",
    },
    grading: {
      correctChoiceId: "c",
      fullScore: 120,
    },
  },
  "token-mine": {
    id: "token-mine",
    challenge: {
      challengeId: "token-mine",
      title: "The Token Mine",
      setup:
        "Your satchel is full of scrolls. You need to answer: \"When does the festival start?\" Only relevant context helps the model.",
      question: "Which set of scrolls best answers the question without noise?",
      inputMode: "single_choice",
      choices: [
        { id: "a", label: "Festival invite (Saturday 4pm), Sara's favourite colour, last week's weather" },
        { id: "b", label: "Festival invite (Saturday 4pm), town square address" },
        { id: "c", label: "Tom's birthday, Sara's favourite colour, last week's weather" },
        { id: "d", label: "All six scrolls — more context is always better" },
      ],
      mentorLine: "Less, but relevant, beats more context.",
      evaluationGuide: "Correct if the selection is lean and includes the time-bearing scroll.",
      oneLineLesson: "Less, but relevant, beats more.",
    },
    grading: {
      correctChoiceId: "b",
      fullScore: 120,
    },
  },
  "retrieval-library": {
    id: "retrieval-library",
    challenge: {
      challengeId: "retrieval-library",
      title: "The Retrieval Library",
      setup:
        "Three ancient tomes are open. Page A says the tower was built in 1887. Page B says the beacon shines 18 leagues. Page C says visitors climb 142 steps. None mention the tower's height.",
      question: "How tall is the Watchtower of Crane Point?",
      inputMode: "single_choice",
      choices: [
        { id: "a", label: "About 142 metres, based on the number of steps." },
        { id: "b", label: "18 leagues tall, matching the beacon range." },
        { id: "c", label: "The height is not stated in the source pages." },
        { id: "d", label: "Approximately 50 metres — a reasonable estimate for a watchtower." },
      ],
      mentorLine: "If the source does not state it, do not invent it.",
      evaluationGuide: "Correct if the answer says height is not in the source without guessing.",
      oneLineLesson: "If the source does not say it, you do not either.",
    },
    grading: {
      correctChoiceId: "c",
      fullScore: 120,
    },
  },
  "toolbelt-trial": {
    id: "toolbelt-trial",
    challenge: {
      challengeId: "toolbelt-trial",
      title: "The Toolbelt Trial",
      setup:
        "A workshop lead needs a reminder sent to the right helper, but the AI starts with no contact details.",
      question: "Choose one tool for each task.",
      inputMode: "tool_select",
      tasks: [
        {
          id: "find-helper",
          label: "Find the right helper",
          description: "Pick the one tool that can identify who should receive the reminder.",
        },
        {
          id: "prepare-reminder",
          label: "Prepare the reminder",
          description: "Pick the one tool that can draft the follow-up for human review.",
        },
      ],
      tools: [
        {
          id: "contact-lookup",
          label: "Contact Lookup",
          description: "Finds the right helper and their contact details from the team directory.",
        },
        {
          id: "message-draft",
          label: "Message Draft",
          description: "Prepares the reminder so a human can review and send it.",
        },
        {
          id: "image-generator",
          label: "Image Generator",
          description: "Creates visuals, but does not help find or contact the helper.",
        },
        {
          id: "code-runner",
          label: "Code Runner",
          description: "Runs scripts, but the mission needs outreach rather than computation.",
        },
        {
          id: "weather-search",
          label: "Weather Search",
          description: "Checks forecasts, which are irrelevant to this reminder.",
        },
        {
          id: "random-web-search",
          label: "Random Web Search",
          description: "Adds broad noise when the team directory is the right source.",
        },
      ],
      mentorLine: "Each task gets one tool. Pick the specific capability that fits.",
      evaluationGuide:
        "Correct if Find the right helper uses Contact Lookup and Prepare the reminder uses Message Draft.",
      oneLineLesson: "Good tool calling means picking one specific tool for each specific task.",
    },
    grading: {
      correctToolSelections: {
        "find-helper": "contact-lookup",
        "prepare-reminder": "message-draft",
      },
      fullScore: 120,
    },
  },
  "agent-citadel": {
    id: "agent-citadel",
    challenge: {
      challengeId: "agent-citadel",
      title: "The Agent Citadel",
      setup:
        "The Citadel's enchanted snack dispenser is broken — customers pay a coin but no snack drops. You must guide a repair agent through the correct workflow.",
      question: "What is the correct order for a safe agent repair workflow?",
      inputMode: "single_choice",
      choices: [
        { id: "a", label: "Fix the motor, then hope it works." },
        { id: "b", label: "Replace the entire machine to be safe." },
        { id: "c", label: "Plan (diagnose), Fix (target repair), Test (insert coin), Review (check risks), Explain (tell the owner)." },
        { id: "d", label: "Explain what's wrong, then let someone else fix it." },
      ],
      mentorLine: "A good agent flow is plan, fix, test, review, explain.",
      evaluationGuide: "Correct if all five workflow steps are present in the right order.",
      oneLineLesson: "Real agents plan, fix, test, review, then explain.",
    },
    grading: {
      correctChoiceId: "c",
      fullScore: 120,
    },
  },
};

export type Fixture = (typeof PROMPTBOUND_FIXTURES)[LevelId];

export function getFixture(levelId: LevelId): Fixture {
  return PROMPTBOUND_FIXTURES[levelId];
}
