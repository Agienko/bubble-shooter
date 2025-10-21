import {Ball} from "./ball.js";
import {BALL_RADIUS, BALL_SIZE, HEIGHT, WIDTH} from "../../constants/constants.js";


const MAX_WIDTH = WIDTH - BALL_SIZE;

export class Bullet extends Ball{
    constructor(stage, descriptor) {
        super(stage, descriptor);
        this.speed = 30;
        this.vx = Math.cos(descriptor.rotation) * this.speed;
        this.vy = Math.sin(descriptor.rotation) * this.speed;

    }
    init(){
        // this.randomTint();
        this.position.set(WIDTH/2 - BALL_RADIUS, HEIGHT - BALL_RADIUS);
        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;
    }
    tick(){

        this.x += this.vx;
        this.y += this.vy;

        if(this.x < 0 ) {
            this.x = 0;
            this.vx = -this.vx;
        }else if(this.x >= MAX_WIDTH) {
            this.x = MAX_WIDTH;
            this.vx = -this.vx;
        }

        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;

        if(this.y >= HEIGHT) this.toDelete = true;

    }
}