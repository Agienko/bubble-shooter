import {Container} from "pixi.js";
import {COLORS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {Bullet} from "./bullet.js";
import {randomFromArr} from "../../helpers/helper.js";
import {state} from "../../state.js";

export class Gun extends Container{
    constructor(stage) {
        super();
        this.stage = stage;

        this.position.set(WIDTH/2, HEIGHT);
        this.pivot.x = this.width/2;
        this.stage.addChild(this);

        this.eventMode = 'static';

        this.bulletTint = randomFromArr(COLORS);
        state.nextColor.value = this.bulletTint;

    }
    createBullet({x, y}){
        this.rotation = Math.PI/2 + Math.atan2(y - HEIGHT, x - WIDTH/2);
        const bullet = new Bullet(this.stage, {});
        bullet.tint = this.bulletTint;

        this.bulletTint = randomFromArr(COLORS);
        state.nextColor.value = this.bulletTint;

        return bullet;
    }
}