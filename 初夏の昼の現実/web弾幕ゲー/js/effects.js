const game = document.getElementById("game");

if (!game) {
    throw new Error("#game が見つかりません。index.html を確認してください。");
}

let overlay = null;

function getDuration(value, fallback) {
    const duration = Number(value);
    return Number.isFinite(duration) && duration >= 0 ? duration : fallback;
}

function getOverlay() {
    if (overlay?.isConnected) {
        return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "effect-overlay";

    Object.assign(overlay.style, {
        position: "absolute",
        inset: "0",
        zIndex: "10",
        pointerEvents: "none",
        backgroundColor: "#000",
        opacity: "0"
    });

    game.append(overlay);
    return overlay;
}

function getTarget(selector = "#game") {
    const target = document.querySelector(selector);

    if (!target) {
        throw new Error("演出対象 " + selector + " が見つかりません。");
    }

    return target;
}

async function animate(element, keyframes, options) {
    const animation = element.animate(keyframes, options);

    try {
        await animation.finished;
    } catch {
        // 新しい演出によって中断された場合も、物語の進行は止めない。
    }
}

function wait(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

export async function playEffect(event = {}) {
    const name = event.name ?? event.effect;

    switch (name) {
        case "shake":
        case "screenShake":
            await screenShake(event);
            break;

        case "fadeOut":
        case "darken":
            await fadeOut(event);
            break;

        case "fadeIn":
        case "lighten":
            await fadeIn(event);
            break;

        case "flash":
            await flash(event);
            break;

        case "slideIn":
            await slideIn(event);
            break;

        case "wait":
            await wait(getDuration(event.duration, 500));
            break;

        default:
            console.warn("未対応の演出です: " + name);
    }
}

export async function screenShake({ duration, strength } = {}) {
    const shakeDuration = getDuration(duration, 350);
    const distance = Math.max(0, Number(strength) || 12);

    await animate(
        game,
        [
            { transform: "translate(0, 0)" },
            { transform: "translate(" + -distance + "px, " + distance + "px)" },
            { transform: "translate(" + distance + "px, " + -distance + "px)" },
            { transform: "translate(" + -distance + "px, 0)" },
            { transform: "translate(0, 0)" }
        ],
        {
            duration: shakeDuration,
            easing: "ease-in-out"
        }
    );
}

export async function fadeOut({ duration, color } = {}) {
    const effectOverlay = getOverlay();
    const fadeDuration = getDuration(duration, 600);

    effectOverlay.style.backgroundColor = color ?? "#000";
    effectOverlay.style.opacity = "0";

    await animate(
        effectOverlay,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: fadeDuration, easing: "ease-in-out", fill: "forwards" }
    );

    effectOverlay.style.opacity = "1";
}

export async function fadeIn({ duration, color } = {}) {
    const effectOverlay = getOverlay();
    const fadeDuration = getDuration(duration, 600);

    effectOverlay.style.backgroundColor = color ?? "#000";
    effectOverlay.style.opacity = "1";

    await animate(
        effectOverlay,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: fadeDuration, easing: "ease-in-out", fill: "forwards" }
    );

    effectOverlay.style.opacity = "0";
}

export async function flash({ duration, color, opacity } = {}) {
    const effectOverlay = getOverlay();
    const flashDuration = getDuration(duration, 180);
    const peakOpacity = Math.min(1, Math.max(0, Number(opacity) || 0.85));

    effectOverlay.style.backgroundColor = color ?? "#fff";
    effectOverlay.style.opacity = "0";

    await animate(
        effectOverlay,
        [
            { opacity: 0 },
            { opacity: peakOpacity, offset: 0.25 },
            { opacity: 0 }
        ],
        { duration: flashDuration, easing: "ease-out" }
    );

    effectOverlay.style.opacity = "0";
}

export async function slideIn({ target, direction, duration, distance } = {}) {
    const element = getTarget(target ?? "#characters");
    const slideDuration = getDuration(duration, 450);
    const slideDistance = Math.max(0, Number(distance) || 120);
    const transforms = {
        left: "translateX(" + -slideDistance + "px)",
        right: "translateX(" + slideDistance + "px)",
        top: "translateY(" + -slideDistance + "px)",
        bottom: "translateY(" + slideDistance + "px)"
    };
    const from = transforms[direction] ?? transforms.left;

    await animate(
        element,
        [
            { opacity: 0, transform: from },
            { opacity: 1, transform: "translate(0, 0)" }
        ],
        { duration: slideDuration, easing: "ease-out", fill: "forwards" }
    );
}
