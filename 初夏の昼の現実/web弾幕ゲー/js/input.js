let nextCallback = null;

export function setNextCallback(callback) {
    nextCallback = callback;
}

function next() {
    if (nextCallback) {
        nextCallback();
    }
}

document.addEventListener("click", () => {
    next();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        next();
    }
});