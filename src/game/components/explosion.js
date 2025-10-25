import {Particle, ParticleContainer} from "pixi.js";
import gsap from "gsap";
import {getRandomInt, getBallTexture, randomMinMax} from "../../helpers/helper.js";
import {filters, sound} from "@pixi/sound";
import {WIDTH} from "../../constants/constants.js";

const TWO_PI = Math.PI * 2;

let totalParticles = 0;

export class Explosion extends ParticleContainer{
    constructor(stage, descriptor) {
        super({
            dynamicProperties: {
                position: true,
                rotation: false,
                color: false,
                uvs: false,
                vertex: true,
            },
        });
        this.stage = stage;
        this.descriptor = descriptor;
        this.position.set(descriptor.x, descriptor.y);
        let amount = totalParticles.value > 1500 ? 15 : getRandomInt(40, 110);

        const toAdd = amount;
        totalParticles += toAdd;
        sound.play('explode', {
            singleInstance: true,
            volume: 0.08,
            end: 0.7,
            filters: [new filters.StereoFilter(this.x/WIDTH -0.5)]
        })

        for (let i = 0; i < amount; ++i) {
            const scale = randomMinMax(3, 20)/100;
            const particle = new Particle({
                texture: getBallTexture(),
                scaleX: scale,
                scaleY: scale,
                tint: descriptor.tint,
                alpha: randomMinMax(70, 95)/100
            })
            this.addParticle(particle)
            const rnd = Math.random() * TWO_PI;
            const x = Math.cos(rnd) * Math.random() * 314;
            const y = Math.sin(rnd) * Math.random() * 100;

            gsap.to(particle, {x, y, scaleX: 0.002, scaleY: 0.002, duration: 0.5, ease: 'circ.out',
                onComplete: () => {
                    if(--amount === 0) {
                        this.stage.removeChild(this);
                        this.removeParticles()
                        this.destroy({children: true});
                        totalParticles -= toAdd;
                    }
                }})
        }

        this.stage.addChild(this);
    }
}