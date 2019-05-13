import { SceneStates, MyAudio } from "../constants/constants";

export class GameOverScene extends Phaser.Scene {

    private secretText:string;
    private score:string;

    constructor(){
        super({key: "GameOverScene"});
    }

    private init(data):void{
        console.log('[GameOverScene] init()');
        console.log(data);
        
        this.secretText = data.secretText;
        this.score = data.score;
    }

    private preload(){
        console.log('[GameOverScene] preload()');
    }

    private create(){
        console.log('[GameOverScene] create()');
        
        this.sound.play(MyAudio.MusicGameOver);

        // Create Title Text
        let gameoverText = this.add.text(0, 0, "Game Over",
        {
            font: '32px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 2
        });
        gameoverText.setAlign('center');
        gameoverText.setOrigin(0.5, 0.5);
        gameoverText.x = this.sys.canvas.width * 0.5;
        gameoverText.y = 100;

        // Create Score Text
        let scoreText = this.add.text(0, 0, "You scored " + this.score,
        {
            font: '18px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 2
        });
        scoreText.setAlign('center');
        scoreText.setOrigin(0.5, 0.5);
        scoreText.x = this.sys.canvas.width * 0.5;
        scoreText.y = 140;
        
        // Create Restart Button
        let restartButtonText = this.add.text(0, 0, "Restart",
        {
            font: '14px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 1
        });
        restartButtonText.setInteractive();
        restartButtonText.setAlign('center');
        restartButtonText.setOrigin(0.5, 0.5);
        restartButtonText.x = this.sys.canvas.width * 0.5;
        restartButtonText.y = 190;
        restartButtonText.on('pointerdown', this.onRestartButtonDown, this);

        // Create Home Button
        let homeButtonText = this.add.text(0, 0, "Home",
        {
            font: '14px Courier',
            fill: '#ff0000',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 1
        });

        homeButtonText.setInteractive();
        homeButtonText.setAlign('center');
        homeButtonText.setOrigin(0.5, 0.5);
        homeButtonText.x = this.sys.canvas.width * 0.5;
        homeButtonText.y = 220;
        homeButtonText.on('pointerdown', this.onHomeButtonDown, this);

        // Create Secret Text
        let secretText = this.add.text(0, 0, this.secretText,
        {
            font: '8px Courier',
            fill: '#ff0000',
            align: 'center',
            // stroke: '#fff',
            // strokeThickness: 1
        });

        secretText.x = 10;
        secretText.y = this.sys.canvas.height - secretText.height - 10;
    }

    onRestartButtonDown(event: string, fn: any, context: any): any {
        console.log('[GameOverScene] onRestartButtonDown()');

        this.sound.stopAll();
        this.scene.stop(SceneStates.GameOver);
        this.scene.start(SceneStates.Game);
    }

    onHomeButtonDown(event: string, fn: any, context: any): any {
        console.log('[GameOverScene] onHomeButtonDown()');

        this.sound.stopAll();
        this.scene.stop(SceneStates.GameOver);
        this.scene.start(SceneStates.Title);
    }
}