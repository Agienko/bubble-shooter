import {Container, Particle, ParticleContainer} from "pixi.js";
import {COLORS, HEIGHT, WIDTH} from "../../constants/constants.js";
import {Bullet} from "./bullet.js";
import {getTexture, randomFromArr} from "../../helpers/helper.js";

export class Gun extends Container{
    constructor(stage) {
        super();
        this.stage = stage;

        this.particleContainer = new ParticleContainer({});

        const texture = getTexture();

        for (let i = 0; i < 10; ++i) {
            const particle = new Particle({
                texture,
                scaleX: 0.08,
                scaleY: 0.08,
                anchorX: 0.5,
                alpha: 0.8 - i/10,
                anchorY: 0.5,
                x: 0,
                y: -i*24,
            });

            this.particleContainer.addParticle(particle);
        }

        this.addChild(this.particleContainer);

        this.position.set(WIDTH/2, HEIGHT);
        this.pivot.x = this.width/2;
        this.stage.addChild(this);

        this.eventMode = 'static';
        this.on('globalpointermove', e => {
            const {x, y} = e.global;
            this.rotation = Math.PI/2 + Math.atan2(y - HEIGHT, x - WIDTH/2);
        })
        this.bulletTint = randomFromArr(COLORS);
        this.particleContainer.tint = this.bulletTint;

    }
    createBullet({x, y}){
        this.rotation = Math.PI/2 + Math.atan2(y - HEIGHT, x - WIDTH/2);
        const bullet = new Bullet(this.stage, {rotation: this.rotation - Math.PI/2});
        bullet.tint = this.bulletTint;

        this.bulletTint = randomFromArr(COLORS);

        this.particleContainer.tint = this.bulletTint;

        return bullet;
    }
}