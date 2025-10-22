import { Container, FillGradient, Text} from "pixi.js";
import {HEIGHT, WIDTH} from "../constants/constants.js";

import gsap from "gsap";
import {sender} from "../sender/event-sender.js";
import {state} from "../state.js";
import {BallEmitter} from "./ball-emitter.js";

export class Menu extends Container{
    constructor(stage) {
        super();
        this.stage = stage;

        this.ballEmitter = new BallEmitter(this,{});

        this.addChild(this.ballEmitter);

        this.alpha = 0;
        gsap.to(this, {alpha: 1, duration: 0.3})

        this.levels = [{text: 'EASY', id: 2}, {text: 'MEDIUM', id: 1}, {text: 'HARD', id: 0}];
        this.levelId = state.level;

        this.title = new Text({text: 'Bubble Shooter', style: {
            fontWeight: 'bold',
            fontSize: 64,
            fill: new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 },
                colorStops: [
                    { offset: 0, color: '#0040b8' },
                    { offset: 1, color: '#067cf4' }
                ],
                textureSpace: 'local'
            }),
                stroke: { color: '#ffffff', width: 16, join: 'round' },
            }})
        this.title.anchor.set(0.5);
        this.title.position.set(WIDTH/2, HEIGHT/2 - 100);
        this.addChild(this.title);


        this.level = new Text({text: 'Level:', style: {
            fontWeight: 'bold',
            fontSize: 24,
                fill: new FillGradient({
                    type: 'linear',
                    start: { x: 0, y: 0 },
                    end: { x: 0, y: 1 },
                    colorStops: [
                        { offset: 0, color: '#0040b8' },
                        { offset: 1, color: '#067cf4' }
                    ],
                    textureSpace: 'local'
                }),
                stroke: { color: '#ffffff', width: 8, join: 'round' },
            }})
        this.level.anchor.set(0.5);
        this.level.position.set(WIDTH/2, HEIGHT/2  );
        this.level.resolution = 2;
        this.addChild(this.level);

        this.levelValue = new Text({text: '', style: {
                fontWeight: 'bold',
                fontSize: 40,
                fill: new FillGradient({
                    type: 'linear',
                    start: { x: 0, y: 0 },
                    end: { x: 0, y: 1 },
                    colorStops: [
                        { offset: 0, color: '#0040b8' },
                        { offset: 1, color: '#067cf4' }
                    ],
                    textureSpace: 'local'
                }),
                stroke: { color: '#ffffff', width: 10, join: 'round' }
            },
        })
        this.levelValue.anchor.set(0.5);
        this.levelValue.position.set(WIDTH/2, HEIGHT/2 + 50 );

        this.levelValue.eventMode = 'static';
        this.levelValue.cursor = 'pointer';
        this.levelValueTween = gsap.to(this.levelValue.scale, {x: 1.2, y: 1.2, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut'})

        this.levelValue.on('pointerup', () => this.onLevelChange())

        this.levelValue.text = this.levels[this.levelId].text;
        this.level.text = 'Level:';
        this.addChild(this.levelValue);

        this.startButton = new Text({text: 'Start', style: {
            fontWeight: 'bold',
            fontSize: 60,
                fill: new FillGradient({
                    type: 'linear',
                    start: { x: 0, y: 0 },
                    end: { x: 0, y: 1 },
                    colorStops: [
                        { offset: 0, color: '#0040b8' },
                        { offset: 1, color: '#067cf4' }
                    ],
                    textureSpace: 'local'
                }),
                stroke: { color: '#ffffff', width: 14, join: 'round' },
            }});
        this.startButton.anchor.set(0.5);
        this.startButton.position.set(WIDTH/2, HEIGHT - 150);
        this.addChild(this.startButton);

        this.startButton.eventMode = 'static';
        this.startButton.cursor = 'pointer';
        this.startButton.on('pointerup', () => this.onStart())

        this.startButtonTween = gsap.to(this.startButton.scale, {x: 1.2, y: 1.2, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut'})

        this.info = new Text({text: 'Yurii Ahiienko 2025', style: {
                fontSize: 12,
                fill: 'white',
            }});
        this.info.resolution = 2;
        this.info.anchor.set(0.5);
        this.info.position.set(WIDTH/2, HEIGHT  - 14);
        this.addChild(this.info);

        this.stage.addChild(this);

    }

    onLevelChange(){
        this.levelId = (this.levelId + 1) % this.levels.length;
        this.levelValue.text = this.levels[this.levelId].text;
    }

    onStart(){
        gsap.to(this, {alpha: 0, duration: 0.3, onComplete: () => {
                state.level = this.levels[this.levelId].id;
                this.stage.removeChild(this);
                this.destroy();
                sender.send('start')
            }})

    }

    destroy(options) {
        this.levelValueTween.kill();
        this.startButtonTween.kill();
        this.ballEmitter.destroy({children: true});
        this.ballEmitter = null;
        super.destroy(options);
    }
}