export class Player extends Phaser.Physics.Arcade.Sprite{

    public playerWidth:number = 12;
    public playerHeight:number = 26;
    public isJumping:boolean = false;
    public justLanded:boolean = false;
    public hitbox:Phaser.Geom.Rectangle;
    public hitboxDebug:Phaser.GameObjects.Graphics;
    public hasControl:boolean = false;

    constructor(scene:Phaser.Scene, x:number, y:number){
        super(scene, x, y, 'player_idle');
        
        // this.visible = false; // TODO: We are hiding the texture!!!

        this.name = "player";
        // this.hitbox = new Phaser.Geom.Rectangle(0, 0, this.playerWidth, this.playerHeight);
        
        // this.hitboxDebug = scene.add.graphics();
    }

    protected preUpdate(time:number, delta:number): void{
        super.preUpdate(time, delta);
    }

    public customUpdate(time:number, delta:number): void {
        this.hitbox.x = this.body.x;
        this.hitbox.y = this.body.y;

        this.hitboxDebug.clear();
        this.hitboxDebug.lineStyle(1, 0x00ff00);
        this.hitboxDebug.strokeRect(this.hitbox.x, this.hitbox.y, this.playerWidth, this.playerHeight);
    }
}