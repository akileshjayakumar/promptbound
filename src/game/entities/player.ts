import Phaser from "phaser";

const PLAYER_SPRITE_SCALE = 0.18;

type StrikeIntent = {
  range: number;
};

type ControlKeys = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
};

export class Player {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  hp = 100;
  facing: 1 | -1 = 1;
  specialCharge = 0;

  private pendingStrikeIntent: StrikeIntent | null = null;
  private strikeCooldown = 0;
  private strikeTimer = 0;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "developer-apprentice", 0);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);
    this.sprite.setScale(PLAYER_SPRITE_SCALE);
    this.sprite.body.setSize(185, 520);
    this.sprite.body.setOffset(92, 158);
  }

  update(keys: ControlKeys) {
    const body = this.sprite.body;
    const touchingGround = body.blocked.down || body.touching.down;
    const left = keys.left.isDown;
    const right = keys.right.isDown;
    const jumpDown = Phaser.Input.Keyboard.JustDown(keys.up);
    const strikeDown = Phaser.Input.Keyboard.JustDown(keys.down);

    if (left) {
      this.facing = -1;
      this.sprite.setVelocityX(-230);
      this.sprite.setFlipX(true);
    } else if (right) {
      this.facing = 1;
      this.sprite.setVelocityX(230);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
    }

    if (jumpDown && touchingGround) {
      this.sprite.setVelocityY(-520);
    }

    if (this.strikeCooldown > 0) {
      this.strikeCooldown -= this.scene.game.loop.delta;
    }

    if (this.strikeTimer > 0) {
      this.strikeTimer -= this.scene.game.loop.delta;
    }

    if (this.strikeCooldown <= 0 && strikeDown) {
      this.queueStrikeIntent();
    }

    if (this.strikeTimer > 0) {
      this.sprite.setFrame(4);
    } else if (!touchingGround) {
      this.sprite.setFrame(3);
    } else if (Math.abs(this.sprite.body.velocity.x) > 10) {
      this.sprite.setFrame(this.facing === -1 ? 2 : 1);
    } else {
      const tick = Math.floor(this.scene.time.now / 520) % 8;
      this.sprite.setFrame(tick === 7 ? 5 : 0);
    }
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
    this.sprite.setFrame(5);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      yoyo: true,
      repeat: 2,
      duration: 70,
    });
  }

  addInsight(amount: number) {
    this.specialCharge = Math.min(100, this.specialCharge + amount);
  }

  consumeStrikeIntent() {
    const strikeIntent = this.pendingStrikeIntent;
    this.pendingStrikeIntent = null;
    return strikeIntent;
  }

  private queueStrikeIntent() {
    this.strikeCooldown = 360;
    this.strikeTimer = 180;
    this.pendingStrikeIntent = {
      range: 128,
    };

    const x = this.sprite.x + this.facing * 54;
    const slash = this.scene.add.image(x, this.sprite.y - 24, "slash");
    slash.setDepth(11);
    slash.setScale(0.92);
    slash.setAlpha(0.95);
    slash.setFlipX(this.facing === -1);
    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      x: x + this.facing * 18,
      scale: 1.08,
      duration: 160,
      ease: "Sine.out",
      onComplete: () => slash.destroy(),
    });
  }
}
