import {
    showDialogue,
    showBackground,
    showCharacter,
    hideCharacter,
    focusCharacter,
    isTyping,
    finishTyping
} from "./renderer.js";
import { setNextCallback } from "./input.js";

let events = [];
let currentEvent = 0;

async function loadStory() {
    const response = await fetch("story/prologue.json");

    if (!response.ok) {
        throw new Error("シナリオの読み込みに失敗しました");
    }

    const data = await response.json();

    events = data.events;

    showNextEvent();
}

function showNextEvent() {
    if (currentEvent >= events.length) {
        return;
    }

    const event = events[currentEvent];

    if (event.type === "dialogue") {
    if (event.focus) {
        focusCharacter(event.focus);
    }

    showDialogue(
        event.speaker,
        event.text
    );
}

    if (event.type === "background") {
    showBackground(event.image);

   if (event.type === "characterHide") {
    hideCharacter(
        event.id,
        event.animation
    );
}
}

if (event.type === "character") {
    showCharacter(
        event.id,
        event.image,
        event.position,
        event.animation
    );
}
    currentEvent++;
}

function handleNextInput() {
    if (isTyping()) {
        finishTyping();
        return;
    }

    showNextEvent();
}

setNextCallback(handleNextInput);

loadStory();