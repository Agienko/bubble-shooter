import './style.css';
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js';
import {Application, Assets, Sprite, Texture} from "pixi.js";
import {Resizer} from "./resizer/resizer.js";
import {Game} from "./game/game.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const canvasContainer = document.createElement('div');
canvasContainer.classList.add('canvas-container');
document.body.append(canvasContainer);

const resizer = new Resizer(canvasContainer);
resizer.init();

const app = new Application();

await app.init({
    resolution: devicePixelRatio,
    autoDensity: true,
    antialias: false,
    preference: 'webgpu',
    resizeTo: canvasContainer,
    backgroundColor: 0x000,
});

canvasContainer.style.opacity = '0';
canvasContainer.append(app.canvas);



await Assets.load('/ball.png');
await Assets.load('/arrow.png');

new Game(app.stage)
gsap.to(canvasContainer, {opacity: 1, duration: 2, ease: 'power2.inOut'})






