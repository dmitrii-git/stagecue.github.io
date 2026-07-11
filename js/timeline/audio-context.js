// audio-context.js

let context = null;

export function getAudioContext() {

    if (!context) {

        context = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    return context;

}
