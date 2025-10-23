import './style.css';
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js';
import {Application, Assets,} from "pixi.js";
import {Resizer} from "./resizer/resizer.js";
import {Game} from "./game/game.js";
import {sender} from "./sender/event-sender.js";
import {Menu} from "./menu/menu.js";
import { sound } from '@pixi/sound';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const canvasContainer = document.createElement('div');
canvasContainer.classList.add('canvas-container');
document.body.append(canvasContainer);

export const resizer = new Resizer(canvasContainer);
resizer.init();

export const app = new Application();

sound.add('begin', '/begin.mp3');
sound.add('click', '/click.mp3');
sound.add('ball-throw', '/ball-throw.mp3');
sound.add('explode', '/explode.mp3');
sound.add('game-over', '/game-over.mp3');

(async ()=>{

    await app.init({
        resolution: devicePixelRatio,
        autoDensity: true,
        antialias: false,
        preference: 'webgpu',
        resizeTo: canvasContainer,
        backgroundColor: 0x000,
    });

    canvasContainer.append(app.canvas);

    await Assets.load('/ball.png');

    new Menu(app.stage);

    sender.on('start', () => new Game(app.stage));

    sender.on('restart', () => new Menu(app.stage));

})()
