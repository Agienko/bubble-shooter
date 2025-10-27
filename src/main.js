import './style.css';
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from 'pixi.js';
import {Application, Assets,} from "pixi.js";
import {Resizer} from "./resizer/resizer.js";
import {Game} from "./game/game.js";
import {sender} from "./sender/event-sender.js";
import {Menu} from "./menu/menu.js";
import {manifest} from "./config/manifest.js";
import {sound} from "@pixi/sound";


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const canvasContainer = document.createElement('div');
canvasContainer.classList.add('canvas-container');
document.body.append(canvasContainer);

export const resizer = new Resizer(canvasContainer);
export const app = new Application();

(async () => {
    await app.init({
        resolution: devicePixelRatio,
        autoDensity: true,
        antialias: false,
        preference: 'webgpu',
        backgroundColor: 0x000,
    });
    app.resizeTo = canvasContainer;
    canvasContainer.append(app.canvas);
    await Assets.init({manifest});
    await Assets.loadBundle(['sounds', 'textures']);
    sender.send('restart');
})();

sender.on('start', () => new Game(app.stage));

sender.on('restart', () => new Menu(app.stage));

window.addEventListener('focus', () => { // sound resume fix
    const context = sound.context.audioContext;

    if (context.state === 'suspended' || context.state === 'interrupted') {
        const onResume = () => {
            window.removeEventListener('pointerdown', onResume)
            sound.resumeAll();
        }

        window.addEventListener('pointerdown', onResume, { once: true, passive: true });

    }
});
