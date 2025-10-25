import {Ball} from "./ball.js";
import {BALL_RADIUS, BALL_SIZE, HEIGHT, WIDTH} from "../../constants/constants.js";
import {state} from "../../state.js";
import {filters, sound} from "@pixi/sound";

const MAX_WIDTH = WIDTH - BALL_SIZE;

export class Bullet extends Ball{
    constructor(stage, descriptor) {
        super(stage, descriptor);
        this.speed =  18;
        this.vx = Math.cos(state.angle) * this.speed/10;
        this.vy = Math.sin(state.angle) * this.speed/10;
    }
    init(){
        this.position.set(WIDTH/2 - BALL_RADIUS, HEIGHT - BALL_RADIUS);
        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;
    }
    tick(e){

        this.x += this.vx * e.deltaMS;
        this.y += this.vy * e.deltaMS;

        if(this.x < 0 ) {
            this.x = 0;
            this.vx = -this.vx;

            sound.play('ball-throw', {start: 0.01, end: 0.2, speed: 0.8, volume: 0.2, filters: [new filters.StereoFilter(-0.7)] })
        }else if(this.x >= MAX_WIDTH) {
            this.x = MAX_WIDTH;
            this.vx = -this.vx;
            sound.play('ball-throw', {start: 0.01, end: 0.2, speed: 0.8, volume: 0.2, filters: [new filters.StereoFilter(0.7)] })
        }

        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;

        if(this.y >= HEIGHT ) this.toDelete = true;
    }
}