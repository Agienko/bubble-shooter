import {Container, Sprite, Texture} from "pixi.js";
import {COLORS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {Bullet} from "./bullet.js";
import {randomFromArr} from "../../helpers/helper.js";

export class Gun extends Container{
    constructor(stage) {
        super();
        this.stage = stage;

        this.arrow = new Sprite(Texture.from('/arrow.png'))
        this.addChild(this.arrow);
        this.arrow.width = WIDTH/36;
        this.arrow.height = HEIGHT/10;
        this.arrow.anchor.y = 1;

        this.position.set(WIDTH/2, HEIGHT)
        this.stage.addChild(this);

        this.pivot.x = this.arrow.width/2;

        this.eventMode = 'static';
        this.on('globalpointermove', ({global: {x, y}}) => {
            this.rotation = Math.PI/2 + Math.atan2(y - HEIGHT, x - WIDTH/2);
        })
        this.bulletTint = randomFromArr(COLORS);
        this.arrow.tint = this.bulletTint;

    }
    createBullet(){
        const bullet = new Bullet(this.stage, {rotation: this.rotation - Math.PI/2});
        bullet.tint = this.bulletTint;

        this.bulletTint = randomFromArr(COLORS);
        this.arrow.tint = this.bulletTint;

        return bullet;
    }
}