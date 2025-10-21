import {Texture} from "pixi.js";

export const createTexture = textureName => Texture.from(textureName)
export const isExist = value => value !== null && value !== undefined
export const isFunction = func => func instanceof Function;

export const randomMinMax = (min, max) => Math.random() * (max - min) + min;

export const isPortrait = () => innerHeight >= innerWidth;

export const getOrientation = () => isPortrait() ? 'portrait' : 'landscape';

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomFromArr = arr => arr[Math.floor(Math.random() * arr.length)]
