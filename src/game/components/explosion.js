import {Particle, ParticleContainer} from "pixi.js";
import gsap from "gsap";
import {getRandomInt, getTexture} from "../../helpers/helper.js";

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

        let amount = getRandomInt(100, 200);

        for (let i = 0; i < amount; ++i) {
            const particle = new Particle({
                texture: getTexture(),
                scaleX: 0.045,
                scaleY: 0.045,
                tint: descriptor.tint,
            })
            this.addParticle(particle)

            const rnd = Math.random() * Math.PI * 2;
            const x = Math.cos(rnd) * Math.random() * 310;
            const y = Math.sin(rnd) * Math.random() * 110;

            gsap.to(particle, {x, y, alpha: 0, duration: 1, ease: 'expo.out', onComplete: () =>{
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