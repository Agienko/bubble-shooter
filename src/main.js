import './style.css';
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js';
import {Application, Assets,} from "pixi.js";
import {Resizer} from "./resizer/resizer.js";
import {Game} from "./game/game.js";
import {sender} from "./sender/event-sender.js";
import {Menu} from "./menu/menu.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const canvasContainer = document.createElement('div');
canvasContainer.classList.add('canvas-container');
document.body.append(canvasContainer);

export const resizer = new Resizer(canvasContainer);
resizer.init();

export const app = new Application();

await app.init({
    resolution: devicePixelRatio,
    autoDensity: true,
    antialias: false,
    preference: 'webgpu',
    resizeTo: canvasContainer,
    backgroundColor: 0x000,
});

// canvasContainer.style.opacity = '0';
canvasContainer.append(app.canvas);



await Assets.load('/ball.png');
// await Assets.load('/arrow.png');


//
new Menu(app.stage)

sender.on('start', () => {
    new Game(app.stage)
})

sender.on('restart', () => {
    new Menu(app.stage)
})

// new Game(app.stage)
// gsap.to(canvasContainer, {opacity: 1, duration: 2, ease: 'power2.inOut'})






