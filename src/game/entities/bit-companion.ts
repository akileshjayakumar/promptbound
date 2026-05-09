import Phaser from "phaser";

type BitMode = "follow" | "review" | "celebrate" | "failed";

export class BitCompanion {
  sprite: Phaser.GameObjects.Image;

  private mode: BitMode = "follow";
  private floatOffset: number;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.image(x, y, "bit-companion");
    this.sprite.setDepth(14);
    this.sprite.setScale(0.038);
    this.sprite.setAlpha(0.94);
    this.sprite.setOrigin(0.5);
    this.floatOffset = Phaser.Math.Between(0, 1200);
  }

  update(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, delta: number) {
    const side = player.flipX ? 1 : -1;
    const targetX = player.x + side * 58;
    const targetY = player.y - 86 + Math.sin((this.scene.time.now + this.floatOffset) / 340) * 8;
    const lerp = this.mode === "review" ? 0.055 : 0.085;

    this.sprite.x = Phaser.Math.Linear(this.sprite.x, targetX, lerp * (delta / 16.67));
    this.sprite.y = Phaser.Math.Linear(this.sprite.y, targetY, lerp * (delta / 16.67));
    this.sprite.rotation = Math.sin((this.scene.time.now + this.floatOffset) / 520) * 0.055;
  }

  setMode(mode: BitMode) {
    if (this.mode === mode) {
      return;
    }
    this.mode = mode;

    this.scene.tweens.killTweensOf(this.sprite);
    this.sprite.clearTint();

    if (mode === "review") {
      this.sprite.setTint(0x9bd7e8);
      this.scene.tweens.add({
        targets: this.sprite,
        scale: 0.044,
        duration: 220,
        ease: "Sine.out",
      });
      return;
    }

    if (mode === "celebrate") {
      this.sprite.setTint(0xfff0a8);
      this.scene.tweens.add({
        targets: this.sprite,
        y: this.sprite.y - 18,
        scale: 0.05,
        duration: 180,
        yoyo: true,
        repeat: 3,
        ease: "Sine.inOut",
        onComplete: () => this.setMode("follow"),
      });
      return;
    }

    if (mode === "failed") {
      this.sprite.setTint(0xfca5a5);
      this.scene.tweens.add({
        targets: this.sprite,
        angle: { from: -8, to: 8 },
        duration: 80,
        yoyo: true,
        repeat: 4,
        ease: "Sine.inOut",
        onComplete: () => this.setMode("follow"),
      });
      return;
    }

    this.scene.tweens.add({
      targets: this.sprite,
      scale: 0.038,
      duration: 180,
      ease: "Sine.out",
    });
  }

  pulse(tint = 0xfff0a8) {
    this.sprite.setTint(tint);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 0.048,
      duration: 120,
      yoyo: true,
      ease: "Sine.out",
      onComplete: () => {
        if (this.mode === "follow") {
          this.sprite.clearTint();
        }
      },
    });
  }
}
