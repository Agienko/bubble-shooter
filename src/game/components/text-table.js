import {Container, Text} from "pixi.js";
import {effect} from "@preact/signals-core";
import {WIDTH} from "../../constants/constants.js";
import {state} from "../../state.js";
import gsap from "gsap";

export class TextTable extends Container {
    constructor(stage, attemptsSignal) {
        super();
        this.stage = stage;
        this.attemptsSignal = attemptsSignal;
        this.alpha = 0.7

        this.tween = null;
        this.stage.addChild(this);

        this.score = new Text({
            text: 'score: 0',
            style: {
                fontSize: 24,
                fill: 'white',
            }
        })
        this.addChild(this.score);

        this.attempts = new Text({
            text: '3/3',
            style: {
                fontSize: 24,
                fill: 'white',
            }
        })
        this.attempts.anchor.x = 1;
        this.attempts.x = WIDTH - 20
        this.addChild(this.attempts);

        this.stop = effect(() => {
            if(state.inProcess.value) return;
            this.attempts.text = `${3 - this.attemptsSignal.value}/3`
        })

        state.score.value = 0;
        this.stop2 = effect(() => {

            const target = {value: +this.score.text}
            this.tween = gsap.to(target, {value: state.score.value, duration: 0.25,
                onUpdate: () => {
                    this.score.text = `score: ${Math.floor(target.value)}`
                },
                onComplete: () => {
                    this.score.text = `score: ${state.score.value}`
                }
            });
            return () => this.tween?.kill()

        })
    }

    destroy(options) {
        this.stop();
        this.stop2();
        this.tween?.kill();
        this.tween = null;
        super.destroy(options);
    }
}