
import {COLORS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {Bullet} from "./bullet.js";
import {randomFromArr} from "../../helpers/helper.js";
import {state} from "../../state.js";

export class Gun{
    constructor(stage) {
        this.stage = stage;
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