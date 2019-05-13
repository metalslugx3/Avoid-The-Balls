import { SceneStates, GameValues } from "../constants/constants";
import { MyAudio } from "../constants/constants";

/**
 * 2018-08-25
 * 
 * 2018-08-27
 * - Fucking gay ass animations...for a single animation in a texture atlas you gotta
 *    add a suffix like _00, _01, _02 or the damn getAnimationFrames() doesnt understand it.
 *    I repeat for SINGLE animations in a atlas json hash.
 * 
 * 2018-08-28
 * - Created constants for key values.
 * - Loaded sounds
 */

export class BootScene extends Phaser.Scene {

  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "BootScene"
    });
  }

  init(data){
    console.log('[BootScene] init()');    
  }

  preload(): void {
    console.log('[BootScene] preload()');
    
    this.load.atlas('player', './assets/mega_man.png', './assets/mega_man.json');

    this.load.image('logo', './assets/phaser.png');
    this.load.image('player_idle', './assets/player/idle.png');
    this.load.image('player_run', './assets/player/run_01.png');
    this.load.image('ball', './assets/ball/ball.png');

    // Tile Map
    this.load.tilemapTiledJSON('map01', './assets/tilemap/map01.json');
    this.load.spritesheet('tiles1', './assets/mm1cuttiles.gif', {frameWidth:16, frameHeight:16});
  
    // Music
    this.load.audio(MyAudio.MusicTitle, './assets/audio/music_stage_select.ogg');
    this.load.audio(MyAudio.MusicGame, './assets/audio/music_dr_wily_1_stage.ogg');
    this.load.audio(MyAudio.MusicGameOver, './assets/audio/music_game_over.ogg');

    // Sound Effects
    this.load.audio(MyAudio.Jump, './assets/audio/10 - EnemyShoot.wav');
    this.load.audio(MyAudio.Hit, './assets/audio/07 - MegamanDamage.wav');
    this.load.audio(MyAudio.Death, './assets/audio/08 - MegamanDefeat.wav');
    this.load.audio(MyAudio.BallBounce, './assets/audio/10 - EnemyShoot.wav');
    this.load.audio(MyAudio.Score, './assets/audio/10 - EnemyShoot.wav');
    this.load.audio(MyAudio.Landed, './assets/audio/06 - MegamanLand.wav');

    // TODO: Remember we are setting the volume here (LOW) for debugging.
    this.sound.volume = GameValues.allowSound ? GameValues.initialGameVolume : 0;
  }

  create(): void {
    console.log('[BootScene] create()');
    
    this.phaserSprite = this.add.sprite(this.sys.canvas.width * 0.5, this.sys.canvas.height * 0.5, "logo");

    this.time.addEvent({delay: 0, callback: this.onGoToNextScene, callbackScope: this});  
  }

  onGoToNextScene():void{
    console.log('[BootScene] onGoToNextScene()');
    
    this.scene.stop(SceneStates.Boot);
    this.scene.start(SceneStates.Game);
  }
}
