/**
 * As of 2018-08-25 Phaser 3.11 has no true UI button.
 * You can use this: http://www.html5gamedevs.com/topic/36850-solvederror-thisaddbutton-is-not-a-function/
 */
import { SceneStates, MyAudio } from "../constants/constants";

export class TitleScene extends Phaser.Scene {
    constructor(){
        super({key: "TitleScene"});
    }

    init(data){
        console.log('[TitleScene] init()');
    }

    preload(){
        console.log('[TitleScene] preload()');
    }

    create(){
        console.log('[TitleScene] create()');
        
        this.sound.play(MyAudio.MusicTitle);

        // Create Title Text
        let titleText = this.add.text(0, 0, "Avoid the Balls",
        {
            font: '24px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 2
        });
        titleText.setAlign('center');
        titleText.setOrigin(0.5, 0.5);
        titleText.x = this.sys.canvas.width * 0.5;
        titleText.y = titleText.height + 25;
        
        // Create Start Button
        let startButtonText = this.add.text(0, 0, "Start Game",
        {
            font: '14px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 1
        });
        startButtonText.setInteractive();
        startButtonText.setAlign('center');
        startButtonText.setOrigin(0.5, 0.5);
        startButtonText.x = this.sys.canvas.width * 0.5;
        startButtonText.y = this.sys.canvas.height * 0.5;
        startButtonText.on('pointerdown', this.onStartButtonDown, this);
    }

    onStartButtonDown(event: string, fn: any, context: any): any {
        console.log('[TitleScene] onStartButtonDown()');

        this.sound.stopAll();
        this.scene.stop(SceneStates.Title);
        this.scene.start(SceneStates.Game);
    }
}