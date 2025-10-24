
import {COLORS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {Bullet} from "./bullet.js";
import {randomFromArr} from "../../helpers/helper.js";
import {state} from "../../state.js";
import {sound} from "@pixi/sound";

export class Gun{
    constructor(stage) {
        this.stage = stage;
        state.bulletTint.value = randomFromArr(COLORS);
        state.nextTint.value = randomFromArr(COLORS);
    }
    createBullet({x, y}){
        this.rotation = Math.PI/2 + Math.atan2(y - HEIGHT, x - WIDTH/2);

        sound.play('ball-throw', {volume: 0.3, speed: 0.2, start: 0.03});

        const bullet = new Bullet(this.stage, {});
        bullet.tint = state.bulletTint.value;

        state.bulletTint.value = state.nextTint.value;
        state.nextTint.value = randomFromArr(COLORS);
        return bullet
    }
}