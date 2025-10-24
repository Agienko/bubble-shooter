import {state} from "../state.js";
import {Texture} from "pixi.js";

export const randomMinMax = (min, max) => Math.random() * (max - min) + min;

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomFromArr = array => {
    const arr = array.slice(state.level);
    return arr[Math.floor(Math.random() * arr.length)]
}

let texture = null;
export let getBallTexture = () => {
    if(texture) return texture;
    texture = Texture.from('ball');
    return texture;
}
