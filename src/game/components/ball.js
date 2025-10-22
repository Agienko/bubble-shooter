import {Sprite, Texture} from "pixi.js";
import {BALL_COLUM_STEP, BALL_RADIUS, BALL_SIZE, COLORS} from "../../constants/constants.js";
import {randomFromArr} from "../../helpers/helper.js";
import {Explosion} from "./explosion.js";

let texture = null;
let getTexture = () => {
    if(texture) return texture;
    texture = Texture.from('/ball.png');
    return texture;
}

export class Ball extends Sprite{
    constructor(stage, descriptor) {
        super(getTexture());
        this.descriptor = descriptor;
        this.stage = stage;
        this.toDelete = false;
        this.isOnLand = false;

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
    init(descriptor){
        this.i = descriptor.i;
        this.j = descriptor.j;
        this.isGhost = descriptor.isGhost;

        if(this.isGhost) {
        } else {
            this.randomTint(descriptor.tint);
        }
        const add = descriptor.isEven ? 0 : BALL_RADIUS;
        this.position.set(BALL_SIZE*this.i + add, this.j*BALL_COLUM_STEP);
        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;
        if(!this.explodion){
            this.explodion = new Explosion(this.stage,{texture: getTexture(), x: this.globalCenter.x, y: this.globalCenter.y})
        } else {
            this.explodion.position.set(this.globalCenter.x, this.globalCenter.y);
        }
    }


    randomTint(tint){
        this.tint = tint ? tint : randomFromArr(COLORS)
    }
}