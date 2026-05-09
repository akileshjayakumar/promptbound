import Phaser from "phaser";

function drawPixel(scene: Phaser.Scene, key: string, width: number, height: number, draw: (g: Phaser.GameObjects.Graphics) => void) {
  if (scene.textures.exists(key)) {
    return;
  }
  const g = scene.add.graphics();
  draw(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

export function createGameTextures(scene: Phaser.Scene) {
  drawPixel(scene, "player-idle", 52, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(12, 10, 28, 22);
    g.fillStyle(0x5f4734).fillRect(8, 17, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(14, 22, 24, 20);
    g.fillStyle(0x342235).fillRect(18, 28, 4, 4).fillRect(31, 28, 4, 4);
    g.fillStyle(0xf7f0d5).fillRect(23, 35, 7, 2);
    g.fillStyle(0x2f80d0).fillRect(11, 40, 30, 13);
    g.fillStyle(0x8bd6e8).fillRect(15, 42, 20, 4);
    g.fillStyle(0xe7a647).fillRect(35, 39, 8, 14);
    g.fillStyle(0x513826).fillRect(14, 53, 9, 8).fillRect(30, 53, 9, 8);
    g.fillStyle(0xf6c85e).fillRect(6, 35, 6, 6);
  });

  drawPixel(scene, "player-idle-2", 52, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(12, 11, 28, 22);
    g.fillStyle(0x5f4734).fillRect(8, 18, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(14, 23, 24, 20);
    g.fillStyle(0x342235).fillRect(18, 29, 4, 4).fillRect(31, 29, 4, 4);
    g.fillStyle(0xf7f0d5).fillRect(23, 36, 7, 2);
    g.fillStyle(0x2f80d0).fillRect(11, 41, 30, 13);
    g.fillStyle(0x8bd6e8).fillRect(15, 43, 20, 4);
    g.fillStyle(0xe7a647).fillRect(35, 40, 8, 14);
    g.fillStyle(0x513826).fillRect(14, 54, 9, 7).fillRect(30, 54, 9, 7);
    g.fillStyle(0xf6c85e).fillRect(6, 36, 6, 6);
  });

  drawPixel(scene, "player-blink", 52, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(12, 10, 28, 22);
    g.fillStyle(0x5f4734).fillRect(8, 17, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(14, 22, 24, 20);
    g.fillStyle(0x342235).fillRect(18, 30, 4, 1).fillRect(31, 30, 4, 1);
    g.fillStyle(0xf7f0d5).fillRect(23, 35, 7, 2);
    g.fillStyle(0x2f80d0).fillRect(11, 40, 30, 13);
    g.fillStyle(0x8bd6e8).fillRect(15, 42, 20, 4);
    g.fillStyle(0xe7a647).fillRect(35, 39, 8, 14);
    g.fillStyle(0x513826).fillRect(14, 53, 9, 8).fillRect(30, 53, 9, 8);
    g.fillStyle(0xf6c85e).fillRect(6, 35, 6, 6);
  });

  drawPixel(scene, "player-run", 52, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(13, 9, 28, 22);
    g.fillStyle(0x5f4734).fillRect(9, 16, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(15, 21, 24, 20);
    g.fillStyle(0x342235).fillRect(21, 27, 4, 4).fillRect(34, 27, 4, 4);
    g.fillStyle(0x2f80d0).fillRect(11, 39, 30, 13);
    g.fillStyle(0x8bd6e8).fillRect(16, 41, 20, 4);
    g.fillStyle(0xe7a647).fillRect(37, 37, 8, 14);
    g.fillStyle(0x513826).fillRect(10, 53, 12, 7).fillRect(32, 51, 12, 8);
    g.fillStyle(0xf6c85e).fillRect(5, 34, 7, 7);
  });

  drawPixel(scene, "player-jump", 52, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(12, 7, 28, 22);
    g.fillStyle(0x5f4734).fillRect(8, 14, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(14, 19, 24, 20);
    g.fillStyle(0x342235).fillRect(18, 25, 4, 4).fillRect(31, 25, 4, 4);
    g.fillStyle(0x2f80d0).fillRect(11, 37, 30, 13);
    g.fillStyle(0x8bd6e8).fillRect(15, 39, 20, 4);
    g.fillStyle(0xe7a647).fillRect(36, 32, 8, 16);
    g.fillStyle(0x513826).fillRect(13, 51, 10, 8).fillRect(29, 50, 10, 8);
    g.fillStyle(0xf6c85e).fillRect(5, 31, 7, 7);
  });

  drawPixel(scene, "player-attack", 70, 62, (g) => {
    g.fillStyle(0x2f2534).fillRect(12, 10, 28, 22);
    g.fillStyle(0x5f4734).fillRect(8, 17, 36, 18);
    g.fillStyle(0xfbd7ae).fillRect(14, 22, 24, 20);
    g.fillStyle(0x342235).fillRect(18, 28, 4, 4).fillRect(31, 28, 4, 4);
    g.fillStyle(0x2f80d0).fillRect(11, 40, 30, 13);
    g.fillStyle(0xe7a647).fillRect(38, 37, 14, 7);
    g.fillStyle(0xffe08a).fillRect(51, 32, 14, 16);
    g.fillStyle(0x513826).fillRect(14, 53, 9, 8).fillRect(30, 53, 9, 8);
  });

  drawPixel(scene, "warden-placeholder", 54, 48, (g) => {
    g.fillStyle(0x3d2a2f).fillRoundedRect(6, 12, 42, 24, 7);
    g.fillStyle(0xf2a65e).fillRoundedRect(11, 7, 32, 30, 7);
    g.fillStyle(0x5b2e46).fillRect(15, 18, 8, 5).fillRect(31, 18, 8, 5);
    g.fillStyle(0xfff0c2).fillRect(21, 29, 12, 3);
    g.fillStyle(0x4a3528).fillRect(10, 38, 8, 8).fillRect(36, 38, 8, 8);
  });

  drawPixel(scene, "warden-lit", 54, 48, (g) => {
    g.fillStyle(0x3d2a2f).fillRoundedRect(6, 12, 42, 24, 7);
    g.fillStyle(0xffe08a).fillRoundedRect(11, 7, 32, 30, 7);
    g.fillStyle(0x7a2540).fillRect(15, 18, 8, 5).fillRect(31, 18, 8, 5);
    g.fillStyle(0xf9735f).fillRect(21, 29, 12, 3);
    g.fillStyle(0x4a3528).fillRect(10, 38, 8, 8).fillRect(36, 38, 8, 8);
  });

  drawPixel(scene, "stone-platform", 96, 34, (g) => {
    g.fillStyle(0x11111a).fillRect(0, 24, 96, 10);
    g.fillStyle(0x353242).fillRect(0, 4, 96, 22);
    g.fillStyle(0x565161).fillRect(0, 4, 96, 5);
    g.fillStyle(0x242432).fillRect(0, 24, 96, 4);
    for (let x = 0; x < 96; x += 24) {
      g.fillStyle(0x242432).fillRect(x + 22, 8, 3, 16);
      g.fillStyle(0x696474).fillRect(x + 5, 12, 10, 2);
    }
  });

  drawPixel(scene, "lantern", 28, 74, (g) => {
    g.fillStyle(0x3c2b23).fillRect(12, 6, 5, 66);
    g.fillStyle(0x2a211b).fillRect(5, 12, 20, 4);
    g.fillStyle(0xd8953f).fillRect(8, 17, 14, 18);
    g.fillStyle(0xffe08a).fillRect(11, 20, 8, 11);
    g.fillStyle(0x2a211b).fillRect(7, 35, 16, 4);
  });

  drawPixel(scene, "crate", 38, 32, (g) => {
    g.fillStyle(0x6d492d).fillRect(0, 0, 38, 32);
    g.fillStyle(0xb77a45).fillRect(3, 3, 32, 26);
    g.fillStyle(0x4b301f).fillRect(5, 6, 28, 4).fillRect(5, 22, 28, 4).fillRect(16, 3, 4, 26);
  });

  drawPixel(scene, "shard", 20, 24, (g) => {
    g.fillStyle(0x6b4e16).fillRect(8, 0, 4, 4);
    g.fillStyle(0xffd166).fillRect(6, 4, 8, 8);
    g.fillStyle(0xfff0a8).fillRect(4, 12, 12, 8);
    g.fillStyle(0xd99b38).fillRect(8, 20, 4, 4);
  });

  drawPixel(scene, "door-locked", 58, 94, (g) => {
    g.fillStyle(0x3a2a25).fillRect(0, 0, 58, 94);
    g.fillStyle(0x7f5a3a).fillRect(6, 8, 46, 80);
    g.fillStyle(0x4c3427).fillRect(12, 18, 34, 58);
    g.fillStyle(0xe06f5c).fillRect(24, 40, 10, 10);
    g.fillStyle(0xf7d982).fillRect(18, 16, 22, 4);
  });

  drawPixel(scene, "door-open", 58, 94, (g) => {
    g.fillStyle(0x3a2a25).fillRect(0, 0, 58, 94);
    g.fillStyle(0x527447).fillRect(6, 8, 46, 80);
    g.fillStyle(0x24351f).fillRect(12, 18, 34, 58);
    g.fillStyle(0xffe08a).fillRect(18, 16, 22, 4);
    g.fillStyle(0xb9fbc0).fillRect(27, 40, 4, 24);
  });

  drawPixel(scene, "slash", 70, 36, (g) => {
    g.fillStyle(0xffe08a).fillRect(8, 14, 52, 8);
    g.fillStyle(0x9bd7e8).fillRect(48, 10, 14, 16);
    g.fillStyle(0xd8953f).fillRect(4, 17, 10, 2);
  });

  drawPixel(scene, "prompt-pulse", 42, 42, (g) => {
    g.fillStyle(0xffd166).fillRect(18, 4, 6, 6);
    g.fillStyle(0xffd166).fillRect(28, 10, 6, 6);
    g.fillStyle(0xffd166).fillRect(32, 20, 6, 6);
    g.fillStyle(0xffd166).fillRect(28, 30, 6, 6);
    g.fillStyle(0xffd166).fillRect(18, 34, 6, 6);
    g.fillStyle(0xffd166).fillRect(8, 30, 6, 6);
    g.fillStyle(0xffd166).fillRect(4, 20, 6, 6);
    g.fillStyle(0xffd166).fillRect(8, 10, 6, 6);
    g.fillStyle(0x9bd7e8).fillRect(19, 15, 5, 10);
    g.fillStyle(0x9bd7e8).fillRect(19, 29, 5, 5);
  });

}
