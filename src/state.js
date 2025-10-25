import {signal} from "@preact/signals-core";

const restoreSoundState = () => {
    try{
        return JSON.parse(localStorage.getItem('||_bsh_sound_state_||')) ?? true;
    } catch (e){
        return true;
    }
}

export const state = {
    level: 1,
    bulletTint: signal('#FFFFFF'),
    nextTint: signal('#FFFFFF'),
    inProcess: signal(false),
    angle: -Math.PI/2,
    score: signal(0),
    soundState: signal(restoreSoundState()),
}

window.addEventListener('beforeunload', () => {
    localStorage.setItem('||_bsh_sound_state_||', JSON.stringify(state.soundState.value))
})

window.state = state;