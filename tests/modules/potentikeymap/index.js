var KeyCode;
(function (KeyCode) {
    KeyCode["Backspace"] = "Backspace";
    KeyCode["Tab"] = "Tab";
    KeyCode["Enter"] = "Enter";
    KeyCode["ShiftLeft"] = "ShiftLeft";
    KeyCode["ShiftRight"] = "ShiftRight";
    KeyCode["ControlLeft"] = "ControlLeft";
    KeyCode["ControlRight"] = "ControlRight";
    KeyCode["AltLeft"] = "AltLeft";
    KeyCode["AltRight"] = "AltRight";
    KeyCode["Pause"] = "Pause";
    KeyCode["CapsLock"] = "CapsLock";
    KeyCode["Escape"] = "Escape";
    KeyCode["Space"] = "Space";
    KeyCode["PageUp"] = "PageUp";
    KeyCode["PageDown"] = "PageDown";
    KeyCode["End"] = "End";
    KeyCode["Home"] = "Home";
    KeyCode["ArrowLeft"] = "ArrowLeft";
    KeyCode["ArrowUp"] = "ArrowUp";
    KeyCode["ArrowRight"] = "ArrowRight";
    KeyCode["ArrowDown"] = "ArrowDown";
    KeyCode["PrintScreen"] = "PrintScreen";
    KeyCode["Insert"] = "Insert";
    KeyCode["Delete"] = "Delete";
    KeyCode["Digit0"] = "Digit0";
    KeyCode["Digit1"] = "Digit1";
    KeyCode["Digit2"] = "Digit2";
    KeyCode["Digit3"] = "Digit3";
    KeyCode["Digit4"] = "Digit4";
    KeyCode["Digit5"] = "Digit5";
    KeyCode["Digit6"] = "Digit6";
    KeyCode["Digit7"] = "Digit7";
    KeyCode["Digit8"] = "Digit8";
    KeyCode["Digit9"] = "Digit9";
    KeyCode["KeyA"] = "KeyA";
    KeyCode["KeyB"] = "KeyB";
    KeyCode["KeyC"] = "KeyC";
    KeyCode["KeyD"] = "KeyD";
    KeyCode["KeyE"] = "KeyE";
    KeyCode["KeyF"] = "KeyF";
    KeyCode["KeyG"] = "KeyG";
    KeyCode["KeyH"] = "KeyH";
    KeyCode["KeyI"] = "KeyI";
    KeyCode["KeyJ"] = "KeyJ";
    KeyCode["KeyK"] = "KeyK";
    KeyCode["KeyL"] = "KeyL";
    KeyCode["KeyM"] = "KeyM";
    KeyCode["KeyN"] = "KeyN";
    KeyCode["KeyO"] = "KeyO";
    KeyCode["KeyP"] = "KeyP";
    KeyCode["KeyQ"] = "KeyQ";
    KeyCode["KeyR"] = "KeyR";
    KeyCode["KeyS"] = "KeyS";
    KeyCode["KeyT"] = "KeyT";
    KeyCode["KeyU"] = "KeyU";
    KeyCode["KeyV"] = "KeyV";
    KeyCode["KeyW"] = "KeyW";
    KeyCode["KeyX"] = "KeyX";
    KeyCode["KeyY"] = "KeyY";
    KeyCode["KeyZ"] = "KeyZ";
    KeyCode["MetaLeft"] = "MetaLeft";
    KeyCode["MetaRight"] = "MetaRight";
    KeyCode["Numpad0"] = "Numpad0";
    KeyCode["Numpad1"] = "Numpad1";
    KeyCode["Numpad2"] = "Numpad2";
    KeyCode["Numpad3"] = "Numpad3";
    KeyCode["Numpad4"] = "Numpad4";
    KeyCode["Numpad5"] = "Numpad5";
    KeyCode["Numpad6"] = "Numpad6";
    KeyCode["Numpad7"] = "Numpad7";
    KeyCode["Numpad8"] = "Numpad8";
    KeyCode["Numpad9"] = "Numpad9";
    KeyCode["NumpadMultiply"] = "NumpadMultiply";
    KeyCode["NumpadAdd"] = "NumpadAdd";
    KeyCode["NumpadSubtract"] = "NumpadSubtract";
    KeyCode["NumpadDecimal"] = "NumpadDecimal";
    KeyCode["NumpadDivide"] = "NumpadDivide";
    KeyCode["F1"] = "F1";
    KeyCode["F2"] = "F2";
    KeyCode["F3"] = "F3";
    KeyCode["F4"] = "F4";
    KeyCode["F5"] = "F5";
    KeyCode["F6"] = "F6";
    KeyCode["F7"] = "F7";
    KeyCode["F8"] = "F8";
    KeyCode["F9"] = "F9";
    KeyCode["F10"] = "F10";
    KeyCode["F11"] = "F11";
    KeyCode["F12"] = "F12";
    KeyCode["NumLock"] = "NumLock";
    KeyCode["ScrollLock"] = "ScrollLock";
    KeyCode["Semicolon"] = "Semicolon";
    KeyCode["Equal"] = "Equal";
    KeyCode["Comma"] = "Comma";
    KeyCode["Minus"] = "Minus";
    KeyCode["Period"] = "Period";
    KeyCode["Slash"] = "Slash";
    KeyCode["Backquote"] = "Backquote";
    KeyCode["BracketLeft"] = "BracketLeft";
    KeyCode["Backslash"] = "Backslash";
    KeyCode["BracketRight"] = "BracketRight";
    KeyCode["Quote"] = "Quote";
})(KeyCode || (KeyCode = {}));
export class ControlHandler {
    // stores boolean values for the keys pressed
    #keyStates = new Map();
    // stores set of keycodes of buttons pressed currently
    #keysPressed = new Set();
    // stores methods/function that are used to retrieve translated control data
    #controlStates = new Map();
    #focusElement;
    // definitive mouse position relative to window
    #mouseX = null;
    #mouseY = null;
    constructor(focusElement = null) {
        this.#focusElement = focusElement;
        window.addEventListener("keydown", this.#keydown.bind(this));
        window.addEventListener("keyup", this.#keyup.bind(this));
        window.addEventListener("blur", this.#onBlur.bind(this));
        window.addEventListener("mousemove", this.#mousemove.bind(this));
        if (this.#focusElement !== null) {
            const loop = () => {
                window.requestAnimationFrame(loop);
            };
        }
    }
    #getMousePosition() {
        if (this.#focusElement === null ||
            this.#mouseX === null ||
            this.#mouseY === null)
            return { mouseX: this.#mouseX, mouseY: this.#mouseY };
        const rect = this.#focusElement.getBoundingClientRect();
        const pos = {
            mouseX: this.#mouseX - rect.x, mouseY: this.#mouseY - rect.y
        };
        if (pos.mouseX < 0 || pos.mouseX > rect.width ||
            pos.mouseY < 0 || pos.mouseY > rect.height) {
            return { mouseX: null, mouseY: null };
        }
        if (this.#focusElement instanceof HTMLCanvasElement) {
            pos.mouseX *= this.#focusElement.width / rect.width;
            pos.mouseY *= this.#focusElement.height / rect.height;
        }
        return pos;
    }
    #keydown(event) {
        const code = event.code;
        this.#keyStates.set(code, true);
        this.#keysPressed.add(code);
    }
    #keyup(event) {
        const code = event.code;
        this.#keyStates.set(code, false);
        this.#keysPressed.delete(code);
    }
    // Unsetting keyboard events when user tabs away from window
    #onBlur() {
        this.#keyStates.forEach((pressed, key) => {
            this.#keyStates.set(key, false);
            this.#keysPressed.clear();
        });
        this.#mouseX = null;
        this.#mouseY = null;
    }
    #mousemove(event) {
        if (this.#focusElement === null) {
            this.#mouseX = event.clientX;
            this.#mouseY = event.clientY;
            return;
        }
        this.#mouseX = event.clientX;
        this.#mouseY = event.clientY;
    }
    /**
     * Adds a control state with conditional
     * */
    addControlState(name, mapping) {
        this.#controlStates.set(name, mapping);
    }
    getControlValue(name) {
        const mapping = this.#controlStates.get(name);
        if (mapping === undefined)
            throw `Cannot access the control "${name}" since it hasn't been defined!`;
        const mousePos = this.#getMousePosition();
        return mapping({
            keysPressed: this.#keysPressed,
            isKeyPressed: (key) => {
                const value = this.#keyStates.get(key);
                return (value === undefined) ? false : value;
            },
            mouseX: mousePos.mouseX,
            mouseY: mousePos.mouseY,
        });
    }
}
