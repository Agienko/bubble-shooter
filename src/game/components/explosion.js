import {Particle, ParticleContainer} from "pixi.js";
import gsap from "gsap";

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

        this.stage.addChild(this);
    }

    explode(tint){
        for (let i = 0; i < 100; ++i) {
            const particle = new Particle({
                texture: this.descriptor.texture,
                scaleX: 0.04,
                scaleY: 0.04,
                tint: tint,
            })
            this.addParticle(particle)

            const rnd = Math.random()* Math.PI * 2;
            const x = Math.cos(rnd) * Math.random() * 300;
            const y = Math.sin(rnd) * Math.random() * 100;

            gsap.to(particle, {x, y, alpha: 0, duration: 1, ease: 'power4.out', onComplete: () =>{
                    this.removeParticle(particle);
                }})
        }
    }
}