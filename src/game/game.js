import {Container, Sprite, Texture, Ticker} from "pixi.js";
import {BALL_COLUM_STEP, BALL_COUNT_COLUMS, BALL_COUNT_ROWS, BALL_SIZE, HEIGHT, WIDTH} from "../constants/constants.js";
import {Gun} from "./components/gun.js";
import {Ball} from "./components/ball.js";
import gsap from "gsap";
import {FallingBall} from "./components/falling-ball.js";
import {effect, signal} from "@preact/signals-core";

export class Game {
    constructor(stage) {
        this.stage = stage;
        this.isGameOver = signal(false);
        this.balls = [];
        this.bullet = null;
        this.attempts = 0;

        this.inProcess = false;

        this.ballStage = new Container();
        this.stage.addChild(this.ballStage);

        this.createBalls();

        this.gun = new Gun(this.stage);

        this.deadLine = new Sprite(Texture.WHITE);
        this.deadLine.width = WIDTH;
        this.deadLine.alpha = 0.1
        this.deadLine.height = 2;
        this.deadLine.y = this.balls.find(b => b.j + 1 === BALL_COUNT_COLUMS).y + 10;
        this.stage.addChild(this.deadLine);

        this._onPointerUp = () => this.onPointerUp()
        this._onTick = () => this.onTick();

        document.addEventListener('pointerup', this._onPointerUp);
        Ticker.shared.add(this._onTick);


        this.stop = effect(() => {
            if(!this.isGameOver.value) return;
            this.stage.alpha = 0.5;
        })


    }
    createBalls(){
        for(let j = 0; j < BALL_COUNT_COLUMS; j++){
            for(let i = 0; i < BALL_COUNT_ROWS; i++){
                const isEven = j % 2 === 0;
                if(!isEven && i === 10) continue;
                const sprite = new Ball(this.ballStage, {i, j, isEven,
                    isGhost: j > Math.floor((BALL_COUNT_COLUMS - 1)/2)
                });

                this.balls.push(sprite);
            }
        }
    }
    onPointerUp(){
        if(this.bullet || this.inProcess || this.isGameOver.value) return;
        this.inProcess = true;
        this.bullet = this.gun.createBullet();
    }

    onTick(){
        if(!this.bullet || this.bullet.toDelete) return;
        this.bullet.tick();
        if(this.bullet.toDelete) {
            this.bullet.destroy();
            this.bullet = null;
            return;
        }

        if(this.bullet.y <= 5) {
            this.onHit(this.bullet);
            return;
        }

        for(let i = 0; i < this.balls.length; ++i){
            const ball = this.balls[i];
            if(ball.isGhost) continue;

            const deltaX = this.bullet.globalCenter.x - ball.globalCenter.x;
            const deltaY = this.bullet.globalCenter.y - ball.globalCenter.y;

            if(Math.abs(deltaX) <= BALL_SIZE && Math.abs(deltaY) <= BALL_SIZE){
                this.onHit(this.bullet);
                return
            }
        }
    }

    onHit(){
        this.bullet.toDelete = true;
        const tint = this.bullet.tint;

        let closestGhostBall = null;
        let closestDelta = Infinity;

        for(let i = 0; i < this.balls.length; ++i){
            const ghost = this.balls[i];
            if(!ghost.isGhost) continue;

            const deltaX = ghost.globalCenter.x - this.bullet.globalCenter.x;
            const deltaY = ghost.globalCenter.y - this.bullet.globalCenter.y;
            const hypotenuseSqr = deltaX ** 2 + deltaY ** 2;

            if(closestGhostBall === null || closestDelta > hypotenuseSqr) {
                closestGhostBall = ghost;
                closestDelta = hypotenuseSqr;
            }
        }

        if(closestGhostBall === null) {
            console.warn('All balls are full')
            this.isGameOver.value = true;
            return
        }
        const to = {x: closestGhostBall.x, y: closestGhostBall.y, duration: 0.08, ease: 'power2.out'};
        closestGhostBall.x = this.bullet.x;
        closestGhostBall.y = this.bullet.y;

        this.bullet.destroy();
        this.bullet = null;

        gsap.to(closestGhostBall, to)

        closestGhostBall.isGhost = false;
        closestGhostBall.tint = tint;

        this.removeSame(closestGhostBall);
    }

    removeSame(currentBall){
        const currentTint = currentBall.tint;
        const recursive = currentBall => {
            const newBalls = []
            currentBall.toDelete = true;

            for(let i = 0; i < this.balls.length; ++i){
                const ball = this.balls[i];
                if(ball.isGhost || ball.toDelete || currentBall.tint !== ball.tint) continue;

                const deltaX = ball.globalCenter.x - currentBall.globalCenter.x;
                const deltaY = ball.globalCenter.y - currentBall.globalCenter.y;

                if(Math.abs(deltaX) <= BALL_SIZE + 5 && Math.abs(deltaY) <= BALL_SIZE + 5) newBalls.push(ball);
            }

            for(let i = 0; i < newBalls.length; ++i) recursive(newBalls[i]);

        }
        recursive(currentBall);

        const toDeleteAmount = this.balls.filter(b=> b.toDelete && !b.isGhost).length;

        if(toDeleteAmount >= 3){
            this.checkIslands();
            for(let i = 0; i < this.balls.length; ++i){
                const b = this.balls[i];
                if(b.toDelete){
                    b.isGhost = true;
                    if(currentTint === b.tint){
                        b.explodion.explode(currentTint);
                    } else {
                        const fallingBall = new FallingBall(this.stage, {i: b.i, j: b.j - 1});
                        fallingBall.position.set(b.x, b.y);
                        fallingBall.tint = b.tint;
                        gsap.to(fallingBall, {y: fallingBall.y + 300, alpha: 0, duration: 0.5, ease: 'back.in(2.0)', onComplete: () => {
                            fallingBall.destroy();
                            }})
                    }
                    b.tint = 0xffffff
                }
                b.toDelete = false;
                b.isOnLand = false;

            }

            this.checkGameOver()
            if(this.isGameOver.value) return;

            this.inProcess = false;
        } else {

            this.checkGameOver()
            if(this.isGameOver.value) return;

            for(let i = 0; i < this.balls.length; ++i){
                const b = this.balls[i];
                b.toDelete = false;
                b.isOnLand = false;
            }

            if(++this.attempts >= 3) {
                this.addRow();
                this.attempts = 0;
            } else {
                this.inProcess = false;
            }
        }

    }

    addRow(){

        gsap.to(this.ballStage, {y:BALL_COLUM_STEP, duration: 0.2, ease: 'power2.out', onComplete: () => {

                this.ballStage.y = 0;

                for(let i = 0; i < this.balls.length; ++i){
                    const b = this.balls[i];
                    const isLastRow = b.j + 1 === BALL_COUNT_COLUMS;
                    b.init({
                        i: b.i,
                        j: isLastRow ? 0 : b.j + 1,
                        isEven: b.descriptor.isEven,
                        tint: isLastRow ? 0 : b.tint,
                        isGhost: isLastRow ? false: b.isGhost
                    });
                    if(isLastRow) {
                        b.alpha = 0;
                        gsap.to(b, {alpha: 1, duration: 0.2, ease: 'power2.out'});
                    }
                }
                this.inProcess = false;
                this.checkGameOver();

            }})

    }

    checkGameOver(){
        for(let i = 0; i < this.balls.length; ++i){
            const ball = this.balls[i];
            if(ball.isGhost) continue;
            if(ball.j + 1 === BALL_COUNT_COLUMS) {
                this.isGameOver.value = true;
                return true
            }
        }
        return false;
    }

    checkIslands(){

        const topBalls = this.balls.filter(b => b.j === 0 && !b.isGhost && !b.toDelete);

        const recursive = currentBall => {
            const newBalls = []
            currentBall.isOnLand = true;
            for(const ball of this.balls){
                if(ball.isGhost || ball.toDelete || ball.isOnLand) continue;

                const deltaX = ball.globalCenter.x - currentBall.globalCenter.x;
                const deltaY = ball.globalCenter.y - currentBall.globalCenter.y;

                if(Math.abs(deltaX) <= BALL_SIZE + 5 && Math.abs(deltaY) <= BALL_SIZE + 5) newBalls.push(ball);

            }

            for(let i = 0; i < newBalls.length; ++i) recursive(newBalls[i]);

        }

        for(let i = 0; i < topBalls.length; ++i) recursive(topBalls[i]);

        for(let i = 0; i < this.balls.length; ++i){
            const b = this.balls[i];
            if(!b.isOnLand && !b.isGhost) b.toDelete = true;
        }
    }

    destroy(){
        this.stage.children.forEach(c => c.destroy({children:true}));
        this.balls = null;
        this.bullet = null;
        this.attempts = 0;
        this.ballStage.destroy({children: true});
        this.gun.destroy({children: true});
        this.stop()
        document.removeEventListener('pointerup', this._onPointerUp);
        Ticker.shared.remove(this._onTick);
    }
}