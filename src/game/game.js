import {Ticker} from "pixi.js";
import {BALL_COUNT_COLUMS, BALL_COUNT_ROWS, BALL_SIZE} from "../constants/constants.js";
import {Gun} from "./components/gun.js";
import {Ball} from "./components/ball.js";
import gsap from "gsap";

export class Game {
    constructor(stage) {
        this.stage = stage;

        this.balls = [];
        this.bullets = new Set();

        for(let j = 0; j < BALL_COUNT_COLUMS; j++){
            for(let i = 0; i < BALL_COUNT_ROWS; i++){
                const isEven = j % 2 === 0;
                if(!isEven && i === 10) continue;
                const sprite = new Ball(this.stage, {i, j});

                this.balls.push(sprite);
            }
        }

        this.gun = new Gun(this.stage);

        document.addEventListener('pointerup', e => {
            const bullet = this.gun.createBullet();
            this.bullets.add(bullet);
        })

        Ticker.shared.add(() => {
            for(const bullet of this.bullets){
                bullet.tick();
                if(bullet.toDelete) {
                    this.bullets.delete(bullet);
                    bullet.destroy();
                    return;
                }

                if(bullet.y <= 5) {
                    this.onHit(bullet);
                    return;
                }

                for(const ball of this.balls){
                    if(ball.isGhost) continue;

                    const deltaX = bullet.globalCenter.x - ball.globalCenter.x;
                    const deltaY = bullet.globalCenter.y - ball.globalCenter.y;

                    if(Math.abs(deltaX) <= BALL_SIZE && Math.abs(deltaY) <= BALL_SIZE){
                        this.onHit(bullet);
                        return
                    }
                }

            }

        })

    }

    onHit(bullet){
        this.bullets.delete(bullet);
        const tint = bullet.tint;

        let closestGhostBall = null;
        let closestDelta = Infinity;

        for(const ghost of this.balls){
            if(!ghost.isGhost) continue;

            const deltaX = ghost.globalCenter.x - bullet.globalCenter.x;
            const deltaY = ghost.globalCenter.y - bullet.globalCenter.y;
            const hypotenuseSqr = deltaX ** 2 + deltaY ** 2;

            if(closestGhostBall === null || closestDelta > hypotenuseSqr) {
                closestGhostBall = ghost;
                closestDelta = hypotenuseSqr;
            }

        }

        if(closestGhostBall === null) {
            console.warn('no closest!')
            return
        }
        const to = {x: closestGhostBall.x, y: closestGhostBall.y, duration: 0.08, ease: 'power2.out'};
        closestGhostBall.x = bullet.x;
        closestGhostBall.y = bullet.y;

        bullet.destroy();

        gsap.to(closestGhostBall, to)

        closestGhostBall.isGhost = false;
        closestGhostBall.alpha = 1;
        closestGhostBall.tint = tint;

        this.removeSame(closestGhostBall);
    }

    removeSame(currentBall){
        const recursive = currentBall => {
            const newBalls = []
            currentBall.toDelete = true;

            for(const ball of this.balls){
                if(ball.isGhost || ball.toDelete || currentBall.tint !== ball.tint) continue;

                const deltaX = ball.globalCenter.x - currentBall.globalCenter.x;
                const deltaY = ball.globalCenter.y - currentBall.globalCenter.y;

                if(Math.abs(deltaX) <= BALL_SIZE + 5 && Math.abs(deltaY) <= BALL_SIZE + 5){
                    newBalls.push(ball);
                }
            }

            newBalls.forEach(b => recursive(b));

        }
        recursive(currentBall);

        const toDeleteAmount = this.balls.filter(b=> b.toDelete && !b.isGhost).length;

        if(toDeleteAmount >= 3){
            this.checkIslands();

            for(const b of this.balls){
                if(b.toDelete){
                    b.alpha = 0;
                    b.tint = 0xffffff
                    b.isGhost = true
                }
            }
        }

        this.balls.forEach(b => {
            b.toDelete = false;
            b.isOnLand = false;
        })


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

                if(Math.abs(deltaX) <= BALL_SIZE + 5 && Math.abs(deltaY) <= BALL_SIZE + 5){
                    newBalls.push(ball);
                }
            }

            newBalls.forEach(b => recursive(b));

        }

        topBalls.forEach(b => recursive(b));
        this.balls.forEach(b => {
            if(!b.isOnLand && !b.isGhost) b.toDelete = true;
        })
    }
}