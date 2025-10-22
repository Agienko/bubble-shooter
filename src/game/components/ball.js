import {Sprite} from "pixi.js";
import {BALL_COLUM_STEP, BALL_RADIUS, BALL_SIZE, COLORS} from "../../constants/constants.js";
import {getTexture, randomFromArr} from "../../helpers/helper.js";
import gsap from "gsap";



export class Ball extends Sprite{
    constructor(stage, descriptor) {
        super(getTexture());
        this.descriptor = descriptor;
        this.stage = stage;
        this.toDelete = false;
        this.isOnLand = false;

        this.tween = null;

        this.blendMode = 'overlay';

        this.width = BALL_SIZE;
        this.height = BALL_SIZE;

        this.globalCenter = {x: 0, y: 0};

        this.i = -1;
        this.j = -1;
        this._isGhost = false;

        this.init(descriptor)

        this.stage.addChild(this);

    }
    get isGhost(){
        return this._isGhost;
    }
    set isGhost(value){
        this._isGhost = value;
        this.alpha = value ? 0 : 1;
    }
    setArial(){
        this.tween = gsap.to(this, {alpha: 0, duration: 0.3, yoyo: true, repeat: 5, ease: 'power2.inOut'})
    }
    init(descriptor){
        this.i = descriptor.i;
        this.j = descriptor.j;
        this.isGhost = descriptor.isGhost;

        if(!this.isGhost) this.randomTint(descriptor.tint);

        const add = descriptor.isEven ? 0 : BALL_RADIUS;
        this.position.set(BALL_SIZE*this.i + add, this.j*BALL_COLUM_STEP);
        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;

    }

    randomTint(tint){
        this.tint = tint ? tint : randomFromArr(COLORS)
    }
    destroy(options) {
        this.tween?.kill();
        super.destroy(options);
    }
}