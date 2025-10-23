import {signal} from "@preact/signals-core";

export const state = {
    level: 1,
    nextColor: signal('#FFFFFF'),
    inProcess: signal(false),
    angle: -Math.PI/2,
    score: signal(0),
}

// window.state = state;