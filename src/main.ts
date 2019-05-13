/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @license      Digitsensitive
 */

/// <reference path="../defs/phaser.d.ts"/>

import "phaser";
import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { TitleScene } from "./scenes/titleScene";
import { GameOverScene } from "./scenes/gameoverScene";

// main game configuration
const config: GameConfig = {
  width: 400,
  height: 304,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, TitleScene, GameScene, GameOverScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  zoom: 2,
  pixelArt: true,
  antialias: false,
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  console.log('Window loaded.');
  var game = new Game(config);
};
