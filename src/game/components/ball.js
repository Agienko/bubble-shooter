import {Sprite, Texture} from "pixi.js";
import {BALL_COLUM_STEP, BALL_COUNT_COLUMS, BALL_RADIUS, BALL_SIZE, COLORS} from "../../constants/constants.js";
import {randomFromArr} from "../../helpers/helper.js";

export class Ball extends Sprite{
    constructor(stage, descriptor) {
        super(Texture.from('/ball.png'));

        this.stage = stage;
        this.toDelete = false;
        this.isOnLand = false;

        this.width = BALL_SIZE;
        this.height = BALL_SIZE;

        this.globalCenter = {x: 0, y: 0};

        this.i = -1;
        this.j = -1;
        this.isGhost = false;

        this.init(descriptor)

        this.stage.addChild(this);

    }
    init(descriptor){
        this.i = descriptor.i;
        this.j = descriptor.j;
        this.isGhost = this.j > Math.ceil(BALL_COUNT_COLUMS/2);

        if(this.isGhost) {
            this.alpha = 0;
        } else {
            this.randomTint();
        }
        const add = this.j % 2 === 0 ? 0 : BALL_RADIUS;
        this.position.set(BALL_SIZE*this.i + add, this.j*BALL_COLUM_STEP);
        this.globalCenter.x = this.x + BALL_RADIUS;
        this.globalCenter.y = this.y + BALL_RADIUS;
    }

    randomTint(){
        this.tint = randomFromArr(COLORS)
    }
}