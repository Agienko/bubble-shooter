import {Ball} from "./ball.js";
import {BALL_RADIUS, BALL_SIZE, HEIGHT, WIDTH} from "../../constants/constants.js";
import {state} from "../../state.js";
import {Explosion} from "./explosion.js";


const MAX_WIDTH = WIDTH - BALL_SIZE;

export class Bullet extends Ball{
    constructor(stage, descriptor) {
        super(stage, descriptor);
        this.speed = descriptor.speed ?? 15;
        this.vx = Math.cos(state.angle) * this.speed/10;
        this.vy = Math.sin(state.angle) * this.speed/10;

        this.timeNow = performance.now();

    }
    init(){
        // this.randomTint();
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
        }else if(this.x >= MAX_WIDTH) {
            this.x = MAX_WIDTH;
            this.vx = -this.vx;
        }

        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;

        if(this.y >= HEIGHT ) this.toDelete = true;

        if(this.timeNow + 4_500 < e.lastTime) {
            this.toDelete = true;
            new Explosion(this.stage, {x: this.globalCenter.x, y: this.globalCenter.y, tint: this.tint})
        }

    }
}