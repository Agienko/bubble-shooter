import {Particle, ParticleContainer, Ticker} from "pixi.js";
import {getTexture} from "../game/components/ball.js";
import {randomFromArr} from "../helpers/helper.js";
import {COLORS, HEIGHT, WIDTH} from "../constants/constants.js";

export class BallEmitter extends ParticleContainer{
    constructor(stage, descriptor) {
        super({
            dynamicProperties: {
                position: true,
                rotation: false,
                color: false,
                uvs: false,
                vertex: false,
            },
        });
        this.stage = stage;
        this.descriptor = descriptor;

        this.stage.addChild(this);

        for (let i = 0; i < 10; ++i) {
            this.createParticle(true);
        }

        this._onTick = e => this.onTick(e);

        Ticker.shared.add(this._onTick)

    }
    onTick(e){
        this.particleChildren.forEach(particle => {
            particle.x += particle.vx * e.deltaMS;
            particle.y += particle.vy * e.deltaMS;


            if(particle.y > HEIGHT || particle.x < -100 || particle.x > WIDTH +100) {

                this.removeParticle(particle);
                // console.time('remove')
                this.createParticle();
                // console.timeEnd('remove')
            }
        })
    }

    createParticle(randomHeight = false){
        const scale = Math.random() * 0.3 + 0.1;
        const particle = new Particle({
            texture: getTexture(),
            scaleX: scale,
            scaleY: scale,
            tint: randomFromArr(COLORS),
        })
        particle.scale = scale;
        particle.x = Math.random() * WIDTH;
        if(randomHeight) {
            particle.y = Math.random() * HEIGHT;
        } else {
            particle.y = -100;
        }
        particle.vy = Math.random()*0.9 + 0.1
        particle.vx = (Math.random() - 0.5)*0.8

        this.addParticle(particle)
        return particle;
    }


    destroy(options) {
        Ticker.shared.remove(this._onTick)
        super.destroy(options);
    }


}