import Phaser from "phaser";
import { BitCompanion } from "@/game/entities/bit-companion";
import { Player } from "@/game/entities/player";
import { TrialWarden } from "@/game/entities/trial-warden";
import { LEVELS, getNextLevel } from "@/game/levels/levels";
import { GAME_EVENTS, emitGameEvent } from "@/game/lib/events";
import { createGameTextures } from "@/game/lib/textures";
import type { GameSnapshot, LevelDefinition, LevelId, PuzzleResult } from "@/game/types";

const PLAYER_START_X = 180;
const PLAYER_START_Y = 524;
const GROUND_PLATFORM_Y = 600;

type SceneData = {
  levelId?: LevelId;
  score?: number;
  badges?: string[];
  fromLevelTitle?: string;
  earnedReward?: string;
};

type Keys = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
};

type DialogueFocus = "bit" | "warden" | "door" | "player";

type DialogueLine = {
  speaker: string;
  text: string;
  focus: DialogueFocus;
  duration?: number;
};

export class LevelScene extends Phaser.Scene {
  private level!: LevelDefinition;
  private player!: Player;
  private warden!: TrialWarden;
  private bit!: BitCompanion;
  private keys!: Keys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private shards!: Phaser.Physics.Arcade.StaticGroup;
  private door!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  private score = 0;
  private badges: string[] = [];
  private exitUnlocked = false;
  private puzzleOpen = false;
  private puzzleSolved = false;
  private visitHintCooldown = 0;
  private snapshotTimer = 0;
  private transitioning = false;
  private storyLocked = false;
  private trialBeatStarted = false;
  private startTrialsAccepted = false;
  private fromLevelTitle?: string;
  private earnedReward?: string;
  private mentorLine = "Visit the Warden, hear the trial, then answer clearly.";
  private resultHandler?: EventListener;
  private startTrialsHandler?: EventListener;
  private dialogueBox?: Phaser.GameObjects.Container;
  private dialogueTimers: Phaser.Time.TimerEvent[] = [];

  constructor() {
    super("LevelScene");
  }

  preload() {
    this.load.image("bit-companion", "/assets/game/pets/bit-pet-base-transparent.png");
    this.load.image("level-bg-1", "/assets/game/backgrounds/level-1-grounded-registration-lobby-16x9.png");
    this.load.image("level-bg-2", "/assets/game/backgrounds/level-2-grounded-hackathon-floor-16x9.png");
    this.load.image("level-bg-3", "/assets/game/backgrounds/level-3-grounded-workshop-room-16x9.png");
    this.load.image("level-bg-4", "/assets/game/backgrounds/level-4-grounded-expo-corridor-16x9.png");
    this.load.image("level-bg-5", "/assets/game/backgrounds/level-5-grounded-mainstage-demo-16x9.png");
    this.load.spritesheet("developer-apprentice", "/assets/game/characters/developer-apprentice-concept-sheet-transparent.png", {
      frameWidth: 362,
      frameHeight: 724,
    });
  }

  init(data: SceneData) {
    this.level = LEVELS.find((item) => item.id === data.levelId) ?? LEVELS[0];
    this.score = data.score ?? 0;
    this.badges = data.badges ?? [];
    this.exitUnlocked = false;
    this.puzzleOpen = false;
    this.puzzleSolved = false;
    this.transitioning = false;
    this.storyLocked = false;
    this.trialBeatStarted = false;
    this.startTrialsAccepted = false;
    this.fromLevelTitle = data.fromLevelTitle;
    this.earnedReward = data.earnedReward;
    this.mentorLine = this.level.beginnerLesson;
  }

  create() {
    createGameTextures(this);
    this.physics.world.setBounds(0, 0, 1280, 720);
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.drawBackground();
    this.createPlatforms();

    this.player = new Player(this, PLAYER_START_X, PLAYER_START_Y);
    this.bit = new BitCompanion(this, 82, 452);
    this.warden = new TrialWarden(this, this.level, 940, 536);
    this.door = this.physics.add.staticImage(1185, 526, "door-locked");
    this.door.setDepth(4);

    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.warden.sprite, this.platforms);
    this.physics.add.overlap(this.player.sprite, this.shards, (_, shard) =>
      this.collectShard(shard as Phaser.Physics.Arcade.Image),
    );
    this.physics.add.overlap(this.player.sprite, this.warden.sprite, () => this.visitWarden());
    this.physics.add.overlap(this.player.sprite, this.door, () => this.tryExit());

    this.keys = this.makeKeys();
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);

    this.addWorldLabels();
    this.bindStartTrials();
    this.bindPuzzleResult();
    this.emitSnapshot();

    if (this.fromLevelTitle) {
      this.playLevelArrival();
    } else {
      this.playLevelIntro();
    }
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.warden || !this.keys) {
      return;
    }

    this.bit.update(this.player.sprite, delta);

    if (this.transitioning || this.storyLocked) {
      this.player.sprite.setVelocityX(0);
      this.warden.sprite.setVelocityX(0);
      return;
    }

    this.visitHintCooldown = Math.max(0, this.visitHintCooldown - delta);

    if (!this.puzzleOpen) {
      this.player.update(this.keys);
      this.warden.update(this.player.sprite.x);
      this.checkWardenVisit();
      this.resolveWardenStrike();
      // Kept intentionally empty for the simplified arrow-only control set.
    } else {
      this.player.sprite.setVelocityX(0);
      this.warden.sprite.setVelocityX(0);
    }

    this.snapshotTimer -= delta;
    if (this.snapshotTimer <= 0) {
      this.snapshotTimer = 160;
      this.emitSnapshot();
    }
  }

  private drawBackground() {
    this.cameras.main.setBackgroundColor(0x08090f);

    const generatedBackground = this.add.image(0, 0, `level-bg-${this.level.level}`);
    generatedBackground.setOrigin(0);
    generatedBackground.setDisplaySize(1280, 720);
    generatedBackground.setDepth(-48);
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.shards = this.physics.add.staticGroup();

    for (let x = 48; x < 1260; x += 96) {
      const platform = this.platforms.create(x, GROUND_PLATFORM_Y, "stone-platform");
      platform.setAlpha(0.01).refreshBody();
    }

    const ledges = [
      [390, 520],
      [650, 456],
      [915, 512],
      [1080, 430],
    ];

    for (const [x, y] of ledges) {
      const platform = this.platforms.create(x, y, "stone-platform");
      platform.setScale(1.35, 1).setAlpha(0.01).refreshBody();
    }

    const shardPositions = [
      [360, 462],
      [650, 398],
      [915, 454],
      [1080, 372],
    ];
    for (const [x, y] of shardPositions) {
      const shard = this.shards.create(x, y, "shard");
      shard.setDepth(8);
      this.tweens.add({
        targets: shard,
        y: y - 8,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }
  }

  private addWorldLabels() {
    // Background art now carries the environment, props, and level staging.
  }

  private playLevelIntro() {
    this.queueDialogue(
      [
        {
          speaker: "Bit",
          text: this.level.introBeat,
          focus: "bit",
          duration: 2300,
        },
        {
          speaker: "Bit",
          text: this.level.tutorialHint ?? this.level.beginnerLesson,
          focus: "bit",
          duration: 2100,
        },
      ],
      () => {
        this.storyLocked = false;
      },
    );
  }

  private playTrialSetup() {
    this.trialBeatStarted = true;
    this.storyLocked = true;
    this.player.sprite.setVelocity(0, 0);
    this.warden.sprite.setVelocityX(0);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(this.warden.sprite.x - 170, 336, 420, "Sine.easeInOut");
    this.bit.setMode("review");

    this.queueDialogue(
      [
        {
          speaker: this.level.enemyName,
          text: this.level.enemyTaunt,
          focus: "warden",
          duration: 1900,
        },
        {
          speaker: "Bit",
          text: this.level.trialSetup,
          focus: "bit",
          duration: 2200,
        },
      ],
      () => {
        this.storyLocked = false;
        this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
        this.openPuzzle();
      },
    );
  }

  private makeKeys(): Keys {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is unavailable.");
    }
    return {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
    };
  }

  private bindStartTrials() {
    this.startTrialsHandler = ((event: Event) => {
      event.preventDefault();
      this.acceptStartTrials();
    }) as EventListener;

    window.addEventListener(GAME_EVENTS.startTrials, this.startTrialsHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.startTrialsHandler) {
        window.removeEventListener(GAME_EVENTS.startTrials, this.startTrialsHandler);
      }
    });
  }

  private acceptStartTrials() {
    if (
      this.startTrialsAccepted ||
      this.puzzleOpen ||
      this.puzzleSolved ||
      this.transitioning ||
      this.trialBeatStarted
    ) {
      return;
    }

    this.startTrialsAccepted = true;
    this.clearDialogueTimers();
    this.clearDialogue();
    this.storyLocked = false;
    this.player.sprite.setVelocity(0, 0);
    this.warden.sprite.setVelocityX(0);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.emitMentor(`Reach ${this.level.enemyName}, then press ↓ to strike.`);
    this.emitSnapshot();
  }

  private resolveWardenStrike() {
    const strikeIntent = this.player.consumeStrikeIntent();
    if (!strikeIntent || this.puzzleSolved || this.puzzleOpen || this.trialBeatStarted) {
      return;
    }

    const dx = this.warden.sprite.x - this.player.sprite.x;
    const dy = Math.abs(this.warden.sprite.y - this.player.sprite.y);
    const closeEnough = Math.abs(dx) <= strikeIntent.range && dy < 100;
    if (closeEnough) {
      this.beginWardenTrial();
      return;
    }

    this.emitMentor(`Move closer to ${this.level.enemyName}, then press ↓ to strike.`);
  }

  private collectShard(shard: Phaser.Physics.Arcade.Image) {
    shard.disableBody(true, true);
    this.score += 15;
    this.player.addInsight(28);
    this.bit.pulse(0xfff0a8);
    this.emitMentor("Insight shard collected.");
  }

  private checkWardenVisit() {
    if (this.puzzleOpen || this.puzzleSolved || this.trialBeatStarted) {
      return;
    }

    const dx = Math.abs(this.warden.sprite.x - this.player.sprite.x);
    const dy = Math.abs(this.warden.sprite.y - this.player.sprite.y);
    if (dx <= 112 && dy < 140) {
      this.beginWardenTrial();
    }
  }

  private visitWarden() {
    if (this.visitHintCooldown > 0 || this.puzzleOpen || this.puzzleSolved || this.trialBeatStarted) {
      return;
    }
    this.visitHintCooldown = 1200;
    this.beginWardenTrial();
  }

  private beginWardenTrial() {
    if (this.puzzleOpen || this.puzzleSolved || this.trialBeatStarted) {
      return;
    }

    this.warden.inviteTrial();
    this.player.addInsight(12);
    this.score += 7;
    this.emitMentor(`${this.level.enemyName} has offered a trial. Listen closely.`);
    this.bit.pulse(0x9bd7e8);
    this.playTrialSetup();
  }

  private openPuzzle() {
    this.puzzleOpen = true;
    this.bit.setMode("review");
    this.emitMentor(`${this.level.enemyName} has set the challenge. Clear the trial to open the gate.`);
    emitGameEvent(GAME_EVENTS.puzzleRequest, {
      levelId: this.level.id,
      title: this.level.title,
      concept: this.level.concept,
      objective: this.level.objective,
      enemyName: this.level.enemyName,
      enemyLesson: this.level.enemyLesson,
      introBeat: this.level.introBeat,
      enemyTaunt: this.level.enemyTaunt,
      trialSetup: this.level.trialSetup,
      puzzleKind: this.level.puzzleKind,
      score: this.score,
      beginnerLesson: this.level.beginnerLesson,
      reward: this.level.reward,
    });
  }

  private bindPuzzleResult() {
    this.resultHandler = ((event: Event) => {
      const detail = (event as CustomEvent<PuzzleResult>).detail;
      this.handlePuzzleResult(detail);
    }) as EventListener;

    window.addEventListener(GAME_EVENTS.puzzleResult, this.resultHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.resultHandler) {
        window.removeEventListener(GAME_EVENTS.puzzleResult, this.resultHandler);
      }
    });
  }

  private handlePuzzleResult(result: PuzzleResult) {
    if (!this.puzzleOpen) {
      return;
    }

    this.score += result.points;
    this.emitMentor(result.feedback);

    if (result.correct) {
      this.bit.setMode("celebrate");
      const completed = this.warden.completeTrial();
      this.puzzleSolved = true;
      this.puzzleOpen = false;
      this.exitUnlocked = true;
      this.door.setTexture("door-open");
      if (result.badge && !this.badges.includes(result.badge)) {
        this.badges = [...this.badges, result.badge];
      }
      if (completed) {
        this.time.delayedCall(900, () => {
          this.showDialogue({
            speaker: "Bit",
            text: `${this.level.clearBeat} ${this.level.reward} earned. The exit is open.`,
            focus: "door",
            duration: 2200,
          });
        });
      }
    } else {
      this.warden.showConfusion();
      this.bit.setMode("failed");
      this.puzzleOpen = true;
    }
    this.emitSnapshot();
  }

  private tryExit() {
    if (this.transitioning || this.storyLocked) {
      return;
    }

    if (!this.exitUnlocked) {
      this.showDialogue({
        speaker: "Bit",
        text: `The exit is still locked. Visit ${this.level.enemyName} and clear the trial first.`,
        focus: "door",
        duration: 1800,
      });
      return;
    }

    const next = getNextLevel(this.level.id);
    if (!next) {
      emitGameEvent(GAME_EVENTS.victory, {
        score: this.score,
        badges: this.badges,
      });
      this.scene.pause();
      return;
    }

    this.playLevelExitTransition(next);
  }

  private playLevelExitTransition(next: LevelDefinition) {
    this.transitioning = true;
    const nextScore = this.score + 50;
    const accent = this.level.palette.accent;
    const accentText = this.hexColor(accent);

    this.player.sprite.setVelocity(0, 0);
    this.warden.sprite.setVelocityX(0);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(this.door.x - 230, 340, 620, "Sine.easeInOut");
    this.cameras.main.zoomTo(1.08, 620, "Sine.easeInOut");
    this.cameras.main.shake(180, 0.004);
    this.emitMentor(`${this.level.reward} secured. Gate path aligning to ${next.title}.`);

    const portal = this.add.circle(this.door.x, this.door.y, 12, accent, 0.26);
    portal.setDepth(40);
    portal.setStrokeStyle(4, 0xfff0a8, 0.8);
    this.tweens.add({
      targets: portal,
      alpha: 0.82,
      scale: 5.2,
      duration: 820,
      ease: "Cubic.out",
    });

    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const rune = this.add.rectangle(
        this.door.x + Math.cos(angle) * 50,
        this.door.y + Math.sin(angle) * 72,
        i % 2 === 0 ? 18 : 10,
        5,
        accent,
        0.72,
      );
      rune.setDepth(41);
      rune.setRotation(angle);
      this.tweens.add({
        targets: rune,
        x: this.door.x + Math.cos(angle) * 108,
        y: this.door.y + Math.sin(angle) * 122,
        alpha: 0,
        duration: 780,
        delay: i * 36,
        ease: "Sine.out",
        onComplete: () => rune.destroy(),
      });
    }

    const overlay = this.createTransitionOverlay({
      eyebrow: `LEVEL ${this.level.level} CLEAR`,
      title: this.level.reward,
      subtitle: `Next: Level ${next.level} - ${next.title}`,
      accent,
      accentText,
      activeLevel: next.level,
    });
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 360,
      delay: 260,
      ease: "Sine.out",
    });

    this.time.delayedCall(1720, () => {
      this.cameras.main.fadeOut(420, 5, 6, 12);
    });

    this.time.delayedCall(2180, () => {
      this.scene.start("LevelScene", {
        levelId: next.id,
        score: nextScore,
        badges: this.badges,
        fromLevelTitle: this.level.title,
        earnedReward: this.level.reward,
      } satisfies SceneData);
    });
  }

  private playLevelArrival() {
    this.transitioning = true;
    const accent = this.level.palette.accent;
    const accentText = this.hexColor(accent);
    this.player.sprite.setAlpha(0);
    this.player.sprite.setVelocity(0, 0);
    this.cameras.main.fadeIn(520, 5, 6, 12);
    this.emitMentor(this.level.beginnerLesson);

    const overlay = this.createTransitionOverlay({
      eyebrow: `ARRIVING FROM ${this.fromLevelTitle?.toUpperCase()}`,
      title: `LEVEL ${this.level.level}: ${this.level.title}`,
      subtitle: this.earnedReward ? `New badge logged: ${this.earnedReward}` : this.level.concept,
      accent,
      accentText,
      activeLevel: this.level.level,
    });

    const spawnLight = this.add.circle(this.player.sprite.x, this.player.sprite.y - 12, 18, accent, 0.62);
    spawnLight.setDepth(36);
    this.tweens.add({
      targets: spawnLight,
      alpha: 0,
      scale: 4.4,
      duration: 760,
      ease: "Cubic.out",
      onComplete: () => spawnLight.destroy(),
    });

    this.tweens.add({
      targets: this.player.sprite,
      alpha: 1,
      duration: 420,
      delay: 220,
      ease: "Sine.out",
    });

    this.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 420,
      delay: 980,
      ease: "Sine.in",
      onComplete: () => {
        overlay.destroy();
        this.transitioning = false;
        this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
        this.playLevelIntro();
      },
    });
  }

  private queueDialogue(lines: DialogueLine[], onComplete: () => void) {
    this.storyLocked = true;
    let index = 0;

    const nextLine = () => {
      const line = lines[index];
      if (!line) {
        this.clearDialogue();
        onComplete();
        return;
      }

      this.showDialogue(line);
      index += 1;
      const timer = this.time.delayedCall(line.duration ?? 1800, nextLine);
      this.dialogueTimers.push(timer);
    };

    nextLine();
  }

  private showDialogue(line: DialogueLine) {
    this.clearDialogue();
    this.emitMentor(`${line.speaker}: ${line.text}`);

    const position = this.getDialoguePosition(line.focus);
    const label = this.add.text(0, 0, `${line.speaker}: ${line.text}`, {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#fff6d8",
      lineSpacing: 4,
      wordWrap: { width: 310 },
    });
    label.setOrigin(0.5, 1);

    const bounds = label.getBounds();
    const width = Math.min(360, Math.max(170, bounds.width + 28));
    const height = bounds.height + 22;
    const panel = this.add.rectangle(0, -height / 2 + 6, width, height, 0x080a12, 0.86);
    panel.setStrokeStyle(2, this.level.palette.accent, 0.72);
    const pointer = this.add.triangle(0, 8, -9, 0, 9, 0, 0, 11, 0x080a12, 0.86);
    pointer.setStrokeStyle(2, this.level.palette.accent, 0.58);
    const view = this.cameras.main.worldView;
    const x = Phaser.Math.Clamp(position.x, view.left + width / 2 + 12, view.right - width / 2 - 12);
    const y = Phaser.Math.Clamp(position.y, view.top + height + 20, view.bottom - 22);

    this.dialogueBox = this.add.container(x, y, [panel, label, pointer]);
    this.dialogueBox.setDepth(120);
    this.dialogueBox.setAlpha(0);
    this.dialogueBox.setScale(0.96);

    this.tweens.add({
      targets: this.dialogueBox,
      alpha: 1,
      scale: 1,
      y: y - 8,
      duration: 160,
      ease: "Sine.out",
    });

    if (!this.storyLocked && line.duration) {
      const activeBox = this.dialogueBox;
      this.time.delayedCall(line.duration, () => {
        if (this.dialogueBox === activeBox) {
          this.clearDialogue();
        }
      });
    }
  }

  private clearDialogue() {
    this.dialogueBox?.destroy();
    this.dialogueBox = undefined;
  }

  private clearDialogueTimers() {
    for (const timer of this.dialogueTimers) {
      timer.remove(false);
    }
    this.dialogueTimers = [];
  }

  private getDialoguePosition(focus: DialogueFocus) {
    if (focus === "warden") {
      return { x: this.warden.sprite.x, y: this.warden.sprite.y - 58 };
    }
    if (focus === "door") {
      return { x: this.door.x, y: this.door.y - 110 };
    }
    if (focus === "player") {
      return { x: this.player.sprite.x, y: this.player.sprite.y - 104 };
    }
    return { x: this.bit.sprite.x, y: this.bit.sprite.y - 42 };
  }

  private createTransitionOverlay({
    eyebrow,
    title,
    subtitle,
    accent,
    accentText,
    activeLevel,
  }: {
    eyebrow: string;
    title: string;
    subtitle: string;
    accent: number;
    accentText: string;
    activeLevel: number;
  }) {
    const overlay = this.add.container(0, 0);
    overlay.setDepth(220);
    overlay.setScrollFactor(0);

    const scrim = this.add.rectangle(0, 0, 1280, 720, 0x05060c, 0.78).setOrigin(0);
    const topRail = this.add.rectangle(640, 174, 760, 3, accent, 0.68);
    const bottomRail = this.add.rectangle(640, 546, 760, 3, accent, 0.4);
    const glow = this.add.circle(640, 360, 230, accent, 0.13);
    const core = this.add.rectangle(640, 360, 660, 238, 0x0b1220, 0.74);
    core.setStrokeStyle(2, accent, 0.7);

    overlay.add([scrim, glow, core, topRail, bottomRail]);

    for (let i = 0; i < 8; i += 1) {
      const y = 214 + i * 34;
      const scan = this.add.rectangle(640, y, 600 - i * 14, 2, i % 2 === 0 ? accent : 0xfff0a8, 0.18);
      overlay.add(scan);
      this.tweens.add({
        targets: scan,
        x: i % 2 === 0 ? 666 : 614,
        alpha: 0.42,
        duration: 580 + i * 50,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }

    const eyebrowText = this.add.text(640, 254, eyebrow, {
      fontFamily: "monospace",
      fontSize: "17px",
      color: "#9bd7e8",
      align: "center",
    });
    eyebrowText.setOrigin(0.5);

    const titleText = this.add.text(640, 332, title, {
      fontFamily: "monospace",
      fontSize: "42px",
      color: "#fff6d8",
      align: "center",
      stroke: "#05060c",
      strokeThickness: 6,
    });
    titleText.setOrigin(0.5);

    const subtitleText = this.add.text(640, 404, subtitle, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: accentText,
      align: "center",
    });
    subtitleText.setOrigin(0.5);

    overlay.add([eyebrowText, titleText, subtitleText]);

    const progressStart = 550;
    for (const level of LEVELS) {
      const x = progressStart + (level.level - 1) * 45;
      const pip = this.add.circle(x, 482, 9, level.level <= activeLevel ? accent : 0x253044, 0.95);
      pip.setStrokeStyle(2, level.level === activeLevel ? 0xfff0a8 : 0x5b6478, 0.8);
      overlay.add(pip);

      if (level.level === activeLevel) {
        this.tweens.add({
          targets: pip,
          scale: 1.35,
          duration: 420,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
        });
      }
    }

    this.tweens.add({
      targets: titleText,
      scaleX: { from: 0.92, to: 1 },
      scaleY: { from: 0.92, to: 1 },
      duration: 520,
      ease: "Back.out",
    });

    return overlay;
  }

  private hexColor(value: number) {
    return `#${value.toString(16).padStart(6, "0")}`;
  }

  private emitMentor(message: string) {
    this.mentorLine = message;
    emitGameEvent(GAME_EVENTS.mentor, { message });
  }

  private emitSnapshot() {
    const snapshot: GameSnapshot = {
      levelId: this.level.id,
      level: this.level.level,
      title: this.level.title,
      concept: this.level.concept,
      objective: this.level.objective,
      enemyName: this.level.enemyName,
      enemyShield: this.warden ? this.warden.readiness : 100,
      enemyHp: this.warden ? this.warden.focus : 100,
      playerHp: this.player ? this.player.hp : 100,
      score: this.score,
      insight: this.player ? this.player.specialCharge : 0,
      exitUnlocked: this.exitUnlocked,
      badges: this.badges,
      mentorLine: this.mentorLine,
    };
    emitGameEvent(GAME_EVENTS.snapshot, snapshot);
  }
}
