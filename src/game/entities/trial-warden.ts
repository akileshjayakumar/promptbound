import Phaser from "phaser";
import type { LevelDefinition } from "@/game/types";

export class TrialWarden {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  readiness = 100;
  focus = 100;
  private promptFlashTimer = 0;
  private baseY: number;

  constructor(private scene: Phaser.Scene, private level: LevelDefinition, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "warden-placeholder");
    this.sprite.setTint(level.palette.enemy);
    this.sprite.setDepth(9);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setImmovable(true);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(36, 34);
    this.sprite.body.setOffset(8, 12);
    this.baseY = y;
  }

  update(playerX: number) {
    this.sprite.setVelocityX(0);
    this.sprite.y = this.baseY + Math.sin(this.scene.time.now / 620) * 4;
    this.sprite.setFlipX(playerX > this.sprite.x);
    this.sprite.rotation = Math.sin(this.scene.time.now / 680) * 0.025;

    if (this.promptFlashTimer > 0) {
      this.promptFlashTimer -= this.scene.game.loop.delta;
      if (this.promptFlashTimer <= 0) {
        this.sprite.setTexture("warden-placeholder");
        this.sprite.setTint(this.level.palette.enemy);
      }
    }
  }

  inviteTrial() {
    this.readiness = 0;
    this.flash(0xfff0c2);
  }

  completeTrial() {
    this.focus = 0;
    this.sprite.setVelocity(0, 0);
    this.sprite.setTexture("warden-lit");
    this.sprite.setTint(0xfff0a8);
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 10,
      scale: 1.08,
      duration: 180,
      yoyo: true,
      repeat: 2,
      ease: "Sine.inOut",
      onComplete: () => {
        this.sprite.setTexture("warden-placeholder");
        this.sprite.setTint(this.level.palette.enemy);
        this.sprite.setScale(1);
      },
    });
    return true;
  }

  showConfusion() {
    this.flash(0xfca5a5);
  }

  private flash(tint: number) {
    this.promptFlashTimer = 180;
    this.sprite.setTexture("warden-lit");
    this.sprite.setTint(tint);
  }
}
