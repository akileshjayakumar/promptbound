# Promptbound: The Five Trials of AI

Promptbound is a retro pixel side-scroller that teaches beginner AI engineering through movement, character encounters, and live OpenAI-powered puzzle trials.

## Run

```bash
pnpm dev
```

Open http://localhost:3000.

## OpenAI

The game builds without an API key. Live puzzle generation needs:

```bash
OPENAI_API_KEY=...
OPENAI_TEXT_MODEL=gpt-5.4-nano
```

`OPENAI_TEXT_MODEL` is optional and defaults to `gpt-5.4-nano`.

## Current Draft

- Next.js App Router with a Phaser 3.90 game island.
- Five-level flow: Prompt Gate, Token Mine, Retrieval Library, Toolbelt Trial, Agent Citadel.
- Keyboard movement, jump, Warden/guide encounters, collectibles, badges, and victory screen.
- Game-first presentation with in-world dialogue beats instead of permanent instructional HUD panels.
- Server-only OpenAI routes for challenge generation, answer evaluation, and the final agent-code trial.
- Generated background art, the Promptbound Apprentice sheet, and Bit companion art are wired into the playable scene.
- Character Sprite Maker run manifests are staged in `public/assets/game/generated/`; Apprentice and Bit have approved base images, while row-strip generation and the non-hostile Vague Warden package are still pending.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
