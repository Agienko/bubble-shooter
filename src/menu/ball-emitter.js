import {Particle, ParticleContainer, Ticker} from "pixi.js";
import {getTexture, randomFromArr} from "../helpers/helper.js";
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

        for (let i = 0; i < 25; ++i) this.createParticle();

        this._onTick = e => this.onTick(e);

        Ticker.shared.add(this._onTick)

    }
    onTick(e){
        for(let i = 0; i < this.particleChildren.length; ++i) {
            const particle = this.particleChildren[i];
            particle.x += particle.vx * e.deltaMS;
            particle.y += particle.vy * e.deltaMS;

            if(particle.y > HEIGHT || particle.x < -100 || particle.x > WIDTH +100) {
                this.randomizeParticle(particle);
            }
        }
    }

    randomizeParticle(particle){
        const scale = Math.random() * 0.3 + 0.1;
        particle.scaleX = scale;
        particle.scaleY = scale;
        particle.tint = randomFromArr(COLORS);
        particle.x = Math.random() * WIDTH;
        particle.y = -100;
        particle.vy = 1.5*(Math.random()*0.9 + 0.1)
        particle.vx = (Math.random() - 0.5)*0.8;
    }

    createParticle(){
        const particle = new Particle({texture: getTexture()});
        this.randomizeParticle(particle);
        particle.y = Math.random() * HEIGHT;
        this.addParticle(particle)
        return particle;
    }


    destroy(options) {
        Ticker.shared.remove(this._onTick)
        super.destroy(options);
    }


}