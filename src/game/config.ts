import Phaser from "phaser";
import { LevelScene } from "@/game/scenes/level-scene";

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: "#0f172a",
    pixelArt: true,
    roundPixels: true,
    audio: {
      noAudio: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1120 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [LevelScene],
  };
}
