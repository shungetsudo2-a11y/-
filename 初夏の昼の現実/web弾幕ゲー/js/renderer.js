const speaker = document.getElementById("speaker");
const text = document.getElementById("text");
const background = document.getElementById("background");
const characters = document.getElementById("characters");

let typingTimer = null;
let fullText = "";

export function showDialogue(name, message) {
    speaker.textContent = name;

    stopTyping();

    fullText = message;
    text.textContent = "";

    let index = 0;

    typingTimer = setInterval(() => {
        text.textContent += fullText[index];
        index++;

        if (index >= fullText.length) {
            stopTyping();
        }
    }, 35);
}

export function isTyping() {
    return typingTimer !== null;
}

export function finishTyping() {
    if (!isTyping()) {
        return;
    }

    stopTyping();
    text.textContent = fullText;
}

function stopTyping() {
    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }
}

export function showBackground(image) {
    background.style.backgroundImage =
        `url("assets/backgrounds/${image}")`;
}

export function showCharacter(
    id,
    image,
    position = "center",
    animation = null
) {
    let character = document.getElementById(`character-${id}`);

    if (!character) {
        character = document.createElement("img");
        character.id = `character-${id}`;
        characters.appendChild(character);
    }

    character.src = `assets/characters/${image}`;
    character.className = `character position-${position}`;

    if (animation === "fadeIn") {
        character.animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 350,
                easing: "ease-out"
            }
        );
    }

    if (animation === "slideInLeft") {
        const startTransform =
            position === "center"
                ? "translateX(calc(-50% - 140px))"
                : "translateX(-140px)";

        const endTransform =
            position === "center"
                ? "translateX(-50%)"
                : "translateX(0)";

        character.animate(
            [
                {
                    opacity: 0,
                    transform: startTransform
                },
                {
                    opacity: 1,
                    transform: endTransform
                }
            ],
            {
                duration: 400,
                easing: "ease-out"
            }
        );
    }

    if (animation === "slideInRight") {
        const startTransform =
            position === "center"
                ? "translateX(calc(-50% + 140px))"
                : "translateX(140px)";

        const endTransform =
            position === "center"
                ? "translateX(-50%)"
                : "translateX(0)";

        character.animate(
            [
                {
                    opacity: 0,
                    transform: startTransform
                },
                {
                    opacity: 1,
                    transform: endTransform
                }
            ],
            {
                duration: 400,
                easing: "ease-out"
            }
        );
    }
}

export function hideCharacter(
    id,
    animation = null
) {
    const character = document.getElementById(`character-${id}`);

    if (!character) {
        return;
    }

    if (animation === "fadeOut") {
        const fade = character.animate(
            [
                { opacity: 1 },
                { opacity: 0 }
            ],
            {
                duration: 300,
                easing: "ease-in",
                fill: "forwards"
            }
        );

        fade.finished.then(() => {
            character.remove();
        });

        return;
    }

    character.remove();
}

export function focusCharacter(id) {
    characters.classList.add("focus-active");

    const characterList =
        characters.querySelectorAll(".character");

    characterList.forEach((character) => {
        const isSpeaking =
            character.id === `character-${id}`;

        character.classList.toggle(
            "is-speaking",
            isSpeaking
        );
    });
}