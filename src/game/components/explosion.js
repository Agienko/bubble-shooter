import {Particle, ParticleContainer} from "pixi.js";
import gsap from "gsap";
import {getTexture} from "./ball.js";

export class Explosion extends ParticleContainer{
    constructor(stage, descriptor) {
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
        this.descriptor = descriptor;
        this.position.set(descriptor.x, descriptor.y);

        let amount = 100;

        for (let i = 0; i < amount; ++i) {
            const particle = new Particle({
                texture: getTexture(),
                scaleX: 0.05,
                scaleY: 0.05,
                tint: descriptor.tint,
            })
            this.addParticle(particle)

            const rnd = Math.random() * Math.PI * 2;
            const x = Math.cos(rnd) * Math.random() * 300;
            const y = Math.sin(rnd) * Math.random() * 100;

            gsap.to(particle, {x, y, alpha: 0, duration: 1, ease: 'power4.out', onComplete: () =>{
                    amount--;
                    this.removeParticle(particle);

                    if(amount === 0) {
                        this.stage.removeChild(this);
                        this.destroy({children: true});
                    }
                }})

        }


        this.stage.addChild(this);
    }

}