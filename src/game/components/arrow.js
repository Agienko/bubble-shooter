import {Particle, ParticleContainer, Ticker} from "pixi.js";
import {getTexture} from "../../helpers/helper.js";
import {BALL_RADIUS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {effect} from "@preact/signals-core";
import {state} from "../../state.js";
import gsap from "gsap";


const PERIOD = 2 * WIDTH;
const AMOUNT = 150;
const STEP = 50;
const MAX_SIZE = AMOUNT * STEP;

export class Arrow extends ParticleContainer{
    constructor(stage, balls) {
        super({
            dynamicProperties: {
                position: true,
                rotation: false,
                color: true,
                uvs: false,
                vertex: false,
            },
        });
        this.stage = stage;
        this.balls = balls;

        this.tween = null;

        for (let i = 0; i < AMOUNT; ++i) {
            const r = i*STEP
            const mini = new Particle({
                texture: getTexture(),
                scaleX: 0.1,
                scaleY: 0.1,
                anchorX: 0.5,
                anchorY: 0.5,
                x: WIDTH/2,
                y: HEIGHT - r,
                alpha: 0,
            });
            mini.r = r;
            this.addParticle(mini);
        }

        this.ball = new Particle({
            texture: getTexture(),
            scaleX: 0.4,
            scaleY: 0.4,
            anchorX: 0.5,
            anchorY: 0.5,
            x: WIDTH/2,
            y: HEIGHT,
        });
        this.addParticle(this.ball);


        this.testBall = new Particle({
            texture: getTexture(),
            scaleX: 0.2,
            scaleY: 0.2,
            anchorX: 0.5,
            anchorY: 0.5,
            x: WIDTH/2,
            y: HEIGHT,
            alpha: 0
        });
        this.testBall.r = 0;
        this.addParticle(this.testBall);



        this.stage.addChild(this);

        this.eventMode = 'static';

        this._onPointerMove = ({global}) => this.setAngle(global.x, global.y)
        this.on('globalpointermove', this._onPointerMove)

        this._onTick = e => this.onTick(e);
        Ticker.shared.add(this._onTick)

        this.stop1 = effect(() => {
            if(state.inProcess.value) return;
            this.tint = state.nextColor.value
        })

        this.stop2 = effect(() => {
            this.tween?.kill();
            this.tween = gsap.to(this, {alpha: +!state.inProcess.value, duration: 0.15});
            this.ball.alpha = +!state.inProcess.value;
        })

        this.maxR = MAX_SIZE;

    }

    onTick(e){
        if(state.inProcess.value) return;

        const cos = Math.cos(state.angle);
        const sin = Math.sin(state.angle);

        for (let i = 0; i < this.particleChildren.length; ++i) {
            const mini = this.particleChildren[i];
            if(this.ball === mini) continue;

            mini.x = this.mirroredX(mini.r, cos);
            mini.y = mini.r * sin + HEIGHT;

            if(this.testBall === mini) {
                mini.r += e.deltaMS*4;

                for(let i = 0; i < this.balls.length; i++){
                    const ball = this.balls[i];
                    if(ball.isGhost) continue;
                    const dx = mini.x  - ball.globalCenter.x;
                    const dy = mini.y - ball.globalCenter.y;

                    if(Math.abs(dx) <= BALL_RADIUS + 10 && Math.abs(dy) <= BALL_RADIUS + 10) {
                        this.maxR = mini.r
                        mini.r = 0;
                        break
                    }
                }

                if(mini.r > MAX_SIZE) {
                    this.maxR = MAX_SIZE
                    mini.r = 0;
                }
            } else {



                const corrAlpha = Math.min( mini.y/HEIGHT, 1 - mini.r/Math.min (MAX_SIZE, this.maxR))
                const alpha = Math.max(corrAlpha, 0);
                if(mini.r === 0) {
                    mini.alpha = 1
                } else if(mini.alpha < alpha) {
                    mini.alpha += 0.03;
                } else {
                    mini.alpha -= 0.03;
                }

                mini.r += e.deltaMS/8;
                if(mini.r > MAX_SIZE) mini.r = 0;

            }


        }
    }

    setAngle(x, y){

        const angleY = y - HEIGHT;
        const angleX = x - WIDTH / 2;
        const minDeg = 10 * Math.PI / 360;

        let angle = Math.atan2(angleY, angleX);

        if (angleX > 0) {
            angle = angleY > 0 || angle > -minDeg ? -minDeg : angle;
        } else {
            angle = angleY > 0 || angle < -Math.PI + minDeg ? -Math.PI + minDeg : angle;
        }

        state.angle = angle;

    }
    mirroredX(x, cos){
        const calcX = x * cos + WIDTH / 2;
        const normX = ((calcX % PERIOD) + PERIOD) % PERIOD;
        return normX <= WIDTH ? normX : (PERIOD - normX);
    }

    destroy(options) {
        Ticker.shared.remove(this._onTick);
        this.stop1();
        this.stop2();
        this.off('globalpointermove', this._onPointerMove)
        super.destroy(options);
    }
}