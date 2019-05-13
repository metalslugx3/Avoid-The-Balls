import { Player } from '../player'
import { SceneStates, MyAudio } from "../constants/constants";

export class GameScene extends Phaser.Scene {

    public hasGameStarted:boolean = false;
    private debugGraphics:Phaser.GameObjects.Graphics;
    private level:integer = 1;
    private score:integer = 0;
    private startText:Phaser.GameObjects.Text;
    private levelTimerText:Phaser.GameObjects.Text;
    private levelText:Phaser.GameObjects.Text;
    private scoreText:Phaser.GameObjects.Text;
    private aKey:Phaser.Input.Keyboard.Key;
    private dKey:Phaser.Input.Keyboard.Key;
    private spaceKey:Phaser.Input.Keyboard.Key;

    private player:Player;
    private balls:Phaser.Physics.Arcade.Group;

    private map:Phaser.Tilemaps.Tilemap;
    private groundTiles:Phaser.Tilemaps.Tileset;
    private gameTiles:Phaser.Tilemaps.Tileset;
    private groundLayer:Phaser.Tilemaps.StaticTilemapLayer;
    private backgroundLayer:Phaser.Tilemaps.StaticTilemapLayer;
    
    constructor(){
        super({key: "GameScene"});
    }

    init(data){
        console.log('[GameScene] init()');

        this.level = 0;
        this.score = 0;
        this.timeElapsed = 0;
        this.actualGameTimeElapsed = 0;
        this.timePerBall = 1000;
        this.minTimePerBall = 4000;
        this.maxTimePerBall = 6000;
        
        this.ballMinVX = 50;
        this.ballMaxVX = 60;
        this.ballPosX = 0;
        this.ballMinHeight = 50;
        this.ballMaxHeight = 160;
        this.doubleBallChance = 0.0;

        this.sound.play(MyAudio.MusicGame);
    }

    preload(){
        console.log('[GameScene] preload()');
    }

    create(){
        console.log('[GameScene] create()');

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.aKey.preventDefault = true;
        
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.dKey.preventDefault = true;

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceKey.preventDefault = true;

        this.map = this.make.tilemap({key:'map01'});
        
        this.groundTiles = this.map.addTilesetImage('mm1cuttiles', 'tiles1');
        this.groundLayer = this.map.createStaticLayer('ground', this.groundTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);
        this.physics.world.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);

        this.gameTiles = this.map.addTilesetImage('mm1cuttiles', 'tiles1');
        this.backgroundLayer = this.map.createStaticLayer('background', this.gameTiles, 0, 0);
        let bgOtherLayer = this.map.createStaticLayer('background_other', this.gameTiles, 0, 0);

        this.createStartText();
        this.createLevelTimerText();
        this.createLevelText();
        this.createScoreText();
        this.levelText.setText('Level 1');
        this.scoreText.setText('Score ' + this.score);
        
        this.player = <Player>this.add.existing(new Player(this.scene.scene, 0, 0));
        this.player.setX(this.sys.canvas.width * 0.5);
        this.player.setY(this.sys.canvas.height * 0.5);
        this.player.originY = 0.6;
    
        this.anims.create({
            key: 'run', 
            frames: this.anims.generateFrameNames('player', {prefix:'run_', start:0, end:4, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'jump', 
            frames: this.anims.generateFrameNames('player', {prefix:'jump_', start:0, end:1, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({key: 'idle', frames: [{key: 'player_idle', frame: 0}]});
        
        this.physics.add.existing(this.player);
        this.player.setSize(this.player.playerWidth, this.player.playerHeight);
        this.player.setBounce(0.0, 0.0);
        this.player.setCollideWorldBounds(true);
        this.player.setFriction(0.95, 0.0);
        this.player.setDrag(0.9, 0.0);
        this.player.hasControl = true;

        this.physics.add.collider(this.groundLayer, this.player, this.collideGroundPlayer, this.processGroundPlayer, this);

        this.balls = this.physics.add.group();

        this.balls.createMultiple(
            {
                classType: Phaser.Physics.Arcade.Sprite,
                key: 'ball',
                setXY:{
                    x: -50,
                    y: -50,
                },
                repeat: 50,
                max: 100
            }
        );

        let i = 0;
        this.balls.children.each((ball:Phaser.Physics.Arcade.Sprite) => {
            ball.name = "ball" + i;
            ball.setSize(16, 16);
            ball.setBounce(0.0, 1).
                setCollideWorldBounds(false).
                setFriction(1, 0.0).
                setDrag(1, 0.0).
                setDamping(false).
                setVelocity(0, 0);
            ball.body.moves = false;
            this.physics.add.collider(this.groundLayer, ball, this.collideGroundBall, null, this);
            this.balls.killAndHide(ball);
            i++;
        }, this);

        // for (let i = 0; i < this.balls.getLength(); i++) {
        //     let ball:Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(-50, -50, 'ball');
        //     this.balls.add(ball);
        //     ball.name = "ball"+i;
        //     ball.setSize(16, 16);
        //     ball.setBounce(0.0, 1).
        //         setCollideWorldBounds(false).
        //         setFriction(1, 0.0).
        //         setDrag(1, 0.0).
        //         setDamping(false).
        //         setVelocity(0, 0);
        // }

        // for (let i = 0; i < this.balls.getLength(); i++) {
        //     let ball:Phaser.GameObjects.Sprite = this.balls.getFirstAlive();
        //     (<Phaser.Physics.Arcade.Body>ball.body).moves = false;
        //     this.balls.killAndHide(ball);
        // }

        this.physics.add.collider(this.balls, this.groundLayer);
        this.physics.add.overlap(this.balls, this.player, this.collideBallPlayer, this.processBallPlayer, this);

        this.debugGraphics = this.add.graphics();
        this.debugGraphics.depth = 98;
        this.map.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128), 
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
        });

        let additionalTimeAdded:number = 0;
        let additionalTimePer10:number = 5;
        for (let i = 0; i < 100; i++) {
            this.levelTimers[i] = 10 * i + additionalTimeAdded;

            if (i != 0 && i % 10 == 0){
                additionalTimeAdded += additionalTimePer10;
            }
        }

        // console.table(this.levelTimers);
    }

    private createStartText(): void {
        this.startText = this.add.text(
            this.sys.canvas.width * 0.5, 
            this.sys.canvas.height * 0.5 - 40, 
            "START!", 
            {
                font: '32px Courier',
                fill: '#ff0000',
                align: 'center',
                shadow: {
                    offsetX: -2,
                    offsetY: -2,
                    color: '#000',
                    blur: 2,
                    stroke: true,
                    fill: true
                },
                bold: true
            }
        );
        this.startText.setAlign('center');
        this.startText.setOrigin(0.5, 0.5);
        this.startText.setScrollFactor(0, 0);
        this.startText.setDepth(99);
        this.startText.setPosition(this.sys.canvas.width * 0.5, -50);

        this.doStartAnimation();
    }

    private createLevelTimerText(): void {
        this.levelTimerText = this.add.text(
            0,
            0,
            "9999", 
            {
                font: '20px Courier',
                fill: '#ffffff',
                align: 'center',
                shadow: {
                    offsetX: -1,
                    offsetY: 1,
                    color: '#000',
                    blur: 0,
                    stroke: true,
                    fill: true
                },
                bold: true
            }
        );
        this.levelTimerText.setAlign('center');
        this.levelTimerText.setOrigin(0.5, 0.5);
        this.levelTimerText.setScrollFactor(0, 0);
        this.levelTimerText.setDepth(99);
        this.levelTimerText.setPosition(this.sys.canvas.width * 0.5, 14);
    }

    private createLevelText(): void {
        this.levelText = this.add.text(
            0,
            0,
            "Level 9999", 
            {
                font: '12px Courier',
                fill: '#ffffff',
                align: 'left',
                shadow: {
                    offsetX: -1,
                    offsetY: 1,
                    color: '#000',
                    blur: 0,
                    stroke: true,
                    fill: true
                },
                bold: true
            }
        );
        this.levelText.setAlign('left');
        this.levelText.setOrigin(0.0, 0.0);
        this.levelText.setScrollFactor(0, 0);
        this.levelText.setDepth(99);
        this.levelText.setPosition(4, 2);
    }

    private createScoreText(): void {
        this.scoreText = this.add.text(
            0,
            0,
            "Score 999999", 
            {
                font: '12px Courier',
                fill: '#ffffff',
                align: 'right',
                shadow: {
                    offsetX: -1,
                    offsetY: 1,
                    color: '#000',
                    blur: 0,
                    stroke: true,
                    fill: true
                },
                bold: true
            }
        );
        this.scoreText.setAlign('right');
        this.scoreText.setOrigin(1.0, 0.0);
        this.scoreText.setScrollFactor(0, 0);
        this.scoreText.setDepth(99);
        this.scoreText.setPosition(this.sys.canvas.width - 4, 2);
    }

    private doStartAnimation(): void {
        this.tweens.add({
            targets: this.startText,
            y: this.sys.canvas.height * 0.5 - 40,
            ease: Phaser.Math.Easing.Sine.Out,
            duration: 100,
            repeat: 0,

            hold: 100,
            yoyo: true,
            onYoyo: this.startGame,
            onYoyoScope: this,
            onYoyoParams: [],

            onComplete: () => 
                { 
                    this.startText.x = this.sys.canvas.width * 0.5;
                    this.startText.y = -50;
                },
            onCompleteScope: this,
            onCompleteParams: []
        });
    }

    private startGame():void{
        console.log("GameScene::startGame()");
        
        this.hasGameStarted = true;
    }

    private collideGroundBall(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject): void {
        this.sound.play(MyAudio.BallBounce);
    }

    private collideGroundPlayer(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject): void {
        var player:Player;
        if (obj1 instanceof Player){
            player = <Player>obj1;
        }
        if (obj2 instanceof Player){
            player = <Player>obj2;
        }

        if (!player.justLanded){
            this.sound.play(MyAudio.Landed);
        }
        player.justLanded = true;
    }

    private processGroundPlayer(obj1:any, obj2:any): boolean {
        var player:Player;
        if (obj1 instanceof Player){
            player = <Player>obj1;
        }
        if (obj2 instanceof Player){
            player = <Player>obj2;
        }
        
        return player.hasControl;
    }

    private collideBallPlayer(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject): void {
        let player:Player;
        let ball:Phaser.GameObjects.Sprite;
        if (obj1.name == "player"){
            player = <Player>obj1;
            ball = <Phaser.GameObjects.Sprite>obj2;
        }
        else{
            player = <Player>obj2;
            ball = <Phaser.GameObjects.Sprite>obj1;
        }

        this.sound.stopAll();
        this.sound.play(MyAudio.Death);
        player.anims.play('jump');
        player.hasControl = false;
        player.setVelocity(80, -300);
        player.setAngularVelocity(450);
        player.setCollideWorldBounds(false);
        ball.destroy();
        
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.sound.stopAll();
                this.scene.stop(SceneStates.Game);
                this.scene.start(SceneStates.GameOver, {secretText: "Fuk da Polize!", score: this.score});
            },
            callbackScope: this
        });
    }

    private processBallPlayer(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject): boolean {
        let player:Player;
        let ball:Phaser.GameObjects.Sprite;
        if (obj1.name == "player"){
            player = <Player>obj1;
            ball = <Phaser.GameObjects.Sprite>obj2;
        }
        else{
            player = <Player>obj2;
            ball = <Phaser.GameObjects.Sprite>obj1;
        }

        return player.hasControl;
    }
    
    public update(time:number, delta:number){
        if (!this.hasGameStarted) return;

        let p:Player = (<Player>this.player);

        if (p.hasControl){
            if (!this.aKey.isDown && !this.dKey.isDown){
                if (p.body.blocked.down)
                    p.anims.play('idle', true);
                p.setVelocityX(0);
            }

            if(this.aKey.isDown){;
                if (p.body.blocked.down){
                    p.anims.play('run', true);
                }
                
                p.flipX = true;
                p.setVelocityX(-100)
            }
    
            if(this.dKey.isDown){
                if (p.body.blocked.down){
                    p.anims.play('run', true);
                }
                
                p.flipX = false;
                p.setVelocityX(100);
            }
            
            if (this.spaceKey.isDown && !p.isJumping && p.body.onFloor()){
                p.play('jump', true);
                p.justLanded = false;
                p.isJumping = true;
                p.setVelocityY(-300);
            }

            if (this.player.body.onFloor()){
                p.isJumping = false;
            }
    
            // (<Player>this.player).customUpdate(time, delta);
            
            // this.player.debugBodyColor = 0x0099ff;
            // for (let i = 0; i < this.balls.getChildren().length; i++) {
            //     const element:Phaser.GameObjects.Sprite = <Phaser.GameObjects.Sprite>this.balls.getChildren()[i];
                
            //     if (Phaser.Geom.Rectangle.Overlaps(this.player.body.getBounds(), element.getBounds())){
            //         this.player.debugBodyColor = 0xff9900;
            //     }
            // }
        }

        this.runGameLogic(delta);
    }

    private timeElapsed:number = 0;
    private actualGameTimeElapsed:number = 0;
    private timePerBall:number = 1000;
    private minTimePerBall:number = 4000;
    private maxTimePerBall:number = 6000;
    
    private ballMinVX:number = 50;
    private ballMaxVX:number = 60;
    private ballPosX:number = 0;
    private ballMinHeight:number = 50;
    private ballMaxHeight:number = 160;
    private doubleBallChance:number = 0.0;
    // First one doesn't count.
    private levelTimers = []

    private runGameLogic(delta:number):void{
        this.timeElapsed += delta;
        this.actualGameTimeElapsed += delta * 50;

        let time:number = (this.actualGameTimeElapsed * 0.001);
        this.levelTimerText.setText(time.toFixed(0));
        
        this.score += 1;
        this.scoreText.setText('Score ' + this.score);

        if (this.timeElapsed > this.timePerBall && this.balls.getFirstDead() != null){
            this.timeElapsed = 0;
            let ball:Phaser.Physics.Arcade.Sprite = this.balls.getFirstDead();
            ball.enableBody(true, 0, 0, true, true);
            ball.setPosition(this.ballPosX, Phaser.Math.Between(this.ballMinHeight, this.ballMaxHeight));
            ball.setVelocity(Phaser.Math.Between(this.ballMinVX, this.ballMaxVX), 0);
            ball.body.moves = true;
            this.timePerBall = Phaser.Math.Between(this.minTimePerBall, this.maxTimePerBall);

            if (Phaser.Math.RND.frac() < this.doubleBallChance){
                let ball:Phaser.Physics.Arcade.Sprite = this.balls.getFirstDead();
                ball.enableBody(true, 0, 0, true, true);
                ball.setPosition(this.ballPosX, Phaser.Math.Between(this.ballMinHeight, this.ballMaxHeight));
                ball.setVelocity(Phaser.Math.Between(this.ballMinVX, this.ballMaxVX), 0);
                ball.body.moves = true;
                this.timePerBall = Phaser.Math.Between(this.minTimePerBall, this.maxTimePerBall);
            }
        }
        
        if (this.levelTimers[this.level] != undefined && 
            this.actualGameTimeElapsed > this.levelTimers[this.level] * 1000){
            console.log('Level up (' + (this.level + 1) + ')');
            
            this.level++;
            this.levelText.setText('Level ' + this.level);
            this.minTimePerBall -= 200;
            this.maxTimePerBall -= 200;
            this.ballMinVX--;
            this.ballMaxVX++;

            if (this.level % 10 == 0){
                this.minTimePerBall -= 500;
                this.doubleBallChance += 0.02;
            }

            this.minTimePerBall = Phaser.Math.Clamp(this.minTimePerBall, 500, 8000);
            this.maxTimePerBall = Phaser.Math.Clamp(this.maxTimePerBall, 3000, 8000);
            this.ballMinVX = Phaser.Math.Clamp(this.ballMinVX, 15, 100);
            this.ballMaxVX = Phaser.Math.Clamp(this.ballMaxVX, 15, 100);
            this.doubleBallChance = Phaser.Math.Clamp(this.doubleBallChance, 0, 1);
        }

        this.balls.children.each((ball:Phaser.Physics.Arcade.Sprite) => {
            if (ball.x > this.sys.cameras.main.x + this.sys.cameras.main.width + ball.width){
                this.score += 100 * this.level;
                this.scoreText.setText('Score ' + this.score);
                ball.body.moves = false;
                ball.setPosition(-50, -50);
                this.balls.killAndHide(ball);
            }
        }, this);
    }
}