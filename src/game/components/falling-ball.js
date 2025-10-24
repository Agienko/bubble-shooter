import {Ball} from "./ball.js";
import gsap from "gsap";
import {sound} from "@pixi/sound";

export class FallingBall extends Ball{
    constructor(stage, descriptor) {
        super(stage, descriptor);
            this.position.set(descriptor.x, descriptor.y);
            this.tint = descriptor.tint;
            gsap.to(this, {y: this.y + 320, alpha: 0, duration: 0.5, ease: 'back.in(2.0)',
                onStart: () => {
                    sound.play('falling', {volume: 0.15, speed: 1.2, singleInstance: true});
                },
                onComplete: () => {
                    this.stage.removeChild(this);
                    this.destroy();
                }})
    }
    init(){}

}