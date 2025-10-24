import {signal} from "@preact/signals-core";
import {HEIGHT, RATIO, WIDTH} from "../constants/constants.js";

export class Resizer {
    #canvasContainer;#scale;#inited;
    constructor(canvasContainer) {
        this.#inited = false;

        this.#canvasContainer = canvasContainer;
        this.#scale = signal(1);
        this.init();
    }

    get scale(){
        return this.#scale;
    }

    init(){
        if(this.#inited) return;
        this.#inited = true;

        this.#canvasContainer.style.width = `${WIDTH}px`;
        this.#canvasContainer.style.height = `${HEIGHT}px`;

        addEventListener('resize', () => this.#update());
        this.#update();
    }

    #update() {

        const scale = innerWidth / innerHeight < RATIO ? innerWidth / WIDTH : innerHeight / HEIGHT;
        this.#scale.value = scale;

        this.#canvasContainer.style.transform = `scale(${scale})`;
        this.#canvasContainer.style.left = `${(innerWidth - WIDTH) / 2}px`
        this.#canvasContainer.style.top = `${(innerHeight - HEIGHT) / 2}px`
    }
}
