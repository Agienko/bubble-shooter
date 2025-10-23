import {Container, Sprite, Text, Texture, Ticker} from "pixi.js";
import {BALL_COLUM_STEP, BALL_COUNT_COLUMS, BALL_COUNT_ROWS, BALL_SIZE, HEIGHT, WIDTH} from "../constants/constants.js";
import {Gun} from "./components/gun.js";
import {Ball} from "./components/ball.js";
import gsap from "gsap";
import {FallingBall} from "./components/falling-ball.js";
import {effect, signal} from "@preact/signals-core";
import {Explosion} from "./components/explosion.js";
import {sender} from "../sender/event-sender.js";
import {app, resizer} from "../main.js";
import {Arrow} from "./components/arrow.js";
import {state} from "../state.js";
import {TextTable} from "./components/text-table.js";

export class Game extends Container{
    constructor(stage) {
        super();
        this.stage = stage;

        stage.addChild(this);

        this.alpha = 0;
        gsap.to(this, {alpha: 1, duration: 0.3})

        this.isGameOver = signal(false);
        this.balls = [];
        this.bullet = null;
        this.attempts = signal(0);

        state.inProcess.value = false;

        this.ballStage = new Container();

        this.createBalls();
        this.arrow = new Arrow(this, this.balls);
        this.addChild(this.ballStage);

        this.gun = new Gun(this);

        this.deadLine = new Sprite(Texture.WHITE);
        this.deadLine.tint = 0xaa0000;
        this.deadLine.width = WIDTH;
        this.deadLine.alpha = 0.3
        this.deadLine.height = 2;
        this.deadLine.y = this.balls.find(b => b.j + 1 === BALL_COUNT_COLUMS).y + 10;
        this.addChild(this.deadLine);

        this.textTable = new TextTable(this, this.attempts);
        this.textTable.x = 10;
        this.textTable.y = this.deadLine.y + 10;

        this.addChild(this.textTable);

        this._onPointerUp = e => this.onPointerUp(e)
        this._onTick = e => this.onTick(e);

        window.addEventListener('pointerup', this._onPointerUp);
        Ticker.shared.add(this._onTick);

        this.stop = effect(() => {
            if(!this.isGameOver.value) return;
            this.ballStage.alpha = 0.5;
            const text = new Text({
                text: 'Game Over',
                style: {
                    fontWeight: 'bold',
                    fontSize: 60,
                    fill: 'white',
                }
            });
            text.anchor.set(0.5);
            text.position.set(WIDTH/2, HEIGHT/2 - 120);
            this.addChild(text);

            this.arrow.destroy({children: true});
            this.arrow = null;
            this.stop();

            gsap.to(this, {alpha: 0, delay: 3, duration: 0.5, onComplete: () => {
                    this.stage.removeChild(this);
                    this.destroy({children: true});
                    sender.send('restart')
                }})

        })


    }
    createBalls(){
        for(let j = 0; j < BALL_COUNT_COLUMS; j++){
            for(let i = 0; i < BALL_COUNT_ROWS; i++){
                const isEven = j % 2 === 0;
                if(!isEven && i === 10) continue;
                const sprite = new Ball(this.ballStage, {i, j, isEven,
                    isGhost: j > 5
                });

                this.balls.push(sprite);
            }
        }
    }
    onPointerUp(e){
        if(state.inProcess.value || this.isGameOver.value) return;
        state.inProcess.value = true;

        const rect = app.canvas.getBoundingClientRect();
        const point = {
            x: (e.x - rect.x) / resizer.scale,
            y: (e.y - rect.y) / resizer.scale
        };
        this.arrow.setAngle( point.x, point.y)
        this.bullet = this.gun.createBullet(point);
    }

    onTick(e){
        if(!this.bullet || this.bullet.toDelete) return;
        this.bullet.tick(e);
        if(this.bullet.toDelete) {
            this.bullet.destroy();
            this.bullet = null;
            state.inProcess.value = false;
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
                        new Explosion(this, {x: b.x, y: b.y, tint: b.tint})
                    } else {
                        new FallingBall(this, {x: b.x, y: b.y, tint: b.tint});
                    }
                    b.tint = 0xffffff
                }
                b.toDelete = false;
                b.isOnLand = false;

            }

            this.checkGameOver()
            if(this.isGameOver.value) return;

            state.inProcess.value = false;
        } else {

            this.checkGameOver()
            if(this.isGameOver.value) return;

            for(let i = 0; i < this.balls.length; ++i){
                const b = this.balls[i];
                b.toDelete = false;
                b.isOnLand = false;
            }

            if(++this.attempts.value >= 3) {
                this.addRow();
                this.attempts.value = 0;
            } else {
                state.inProcess.value = false;
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
                state.inProcess.value = false;
                this.checkGameOver();

            }})

    }

    checkGameOver(){
        for(let i = 0; i < this.balls.length; ++i){
            const ball = this.balls[i];
            if(ball.isGhost) continue;
            if(ball.j + 1 === BALL_COUNT_COLUMS) {
                ball.setArial()
                this.isGameOver.value = true;
            }
        }
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

    destroy(p){
        document.removeEventListener('pointerup', this._onPointerUp);
        Ticker.shared.remove(this._onTick);
        this.ballStage.destroy({children: true});
        this.gun.destroy({children: true});
        this.stop()

        this.balls = null;
        this.bullet = null;
        super.destroy(p)
    }
}