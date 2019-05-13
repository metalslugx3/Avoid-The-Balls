// TODO: extend Sprite again and remember that the scene passed in is plugin
export class Player{

    public graphics:Phaser.GameObjects.Graphics;
    private scene:Phaser.Scene;
    private playerWidth:number = 12;
    private playerHeight:number = 32;
    private aKey:Phaser.Input.Keyboard.Key;
    private dKey:Phaser.Input.Keyboard.Key;
    private xPos:number = 0;
    private yPos:number = 0;

    constructor(scene:Phaser.Scene){
        this.scene = scene;
        
        this.xPos = this.scene.sys.canvas.width * 0.5;
        this.yPos = this.scene.sys.canvas.height - this.playerHeight;

        this.graphics = scene.add.graphics();
        this.graphics.lineStyle(1, 0xff00ff);
        this.graphics.strokeRect(this.xPos, this.yPos, this.playerWidth, this.playerHeight);
        
        this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.aKey.preventDefault = true;
        
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.dKey.preventDefault = true;
    }

    public update():void{
        if(this.aKey.isDown){
            this.xPos -= 1;
            console.log(this.xPos);
        }

        if(this.dKey.isDown){
            this.xPos += 1;
            console.log(this.xPos);
        }
        
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xff00ff);
        this.graphics.strokeRect(this.xPos, this.yPos, 15, 40);
    }
}