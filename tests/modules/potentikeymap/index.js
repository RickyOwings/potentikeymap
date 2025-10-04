var ButtonCode;
(function (ButtonCode) {
    ButtonCode["Backspace"] = "Backspace";
    ButtonCode["Tab"] = "Tab";
    ButtonCode["Enter"] = "Enter";
    ButtonCode["ShiftLeft"] = "ShiftLeft";
    ButtonCode["ShiftRight"] = "ShiftRight";
    ButtonCode["ControlLeft"] = "ControlLeft";
    ButtonCode["ControlRight"] = "ControlRight";
    ButtonCode["AltLeft"] = "AltLeft";
    ButtonCode["AltRight"] = "AltRight";
    ButtonCode["Pause"] = "Pause";
    ButtonCode["CapsLock"] = "CapsLock";
    ButtonCode["Escape"] = "Escape";
    ButtonCode["Space"] = "Space";
    ButtonCode["PageUp"] = "PageUp";
    ButtonCode["PageDown"] = "PageDown";
    ButtonCode["End"] = "End";
    ButtonCode["Home"] = "Home";
    ButtonCode["ArrowLeft"] = "ArrowLeft";
    ButtonCode["ArrowUp"] = "ArrowUp";
    ButtonCode["ArrowRight"] = "ArrowRight";
    ButtonCode["ArrowDown"] = "ArrowDown";
    ButtonCode["PrintScreen"] = "PrintScreen";
    ButtonCode["Insert"] = "Insert";
    ButtonCode["Delete"] = "Delete";
    ButtonCode["Digit0"] = "Digit0";
    ButtonCode["Digit1"] = "Digit1";
    ButtonCode["Digit2"] = "Digit2";
    ButtonCode["Digit3"] = "Digit3";
    ButtonCode["Digit4"] = "Digit4";
    ButtonCode["Digit5"] = "Digit5";
    ButtonCode["Digit6"] = "Digit6";
    ButtonCode["Digit7"] = "Digit7";
    ButtonCode["Digit8"] = "Digit8";
    ButtonCode["Digit9"] = "Digit9";
    ButtonCode["KeyA"] = "KeyA";
    ButtonCode["KeyB"] = "KeyB";
    ButtonCode["KeyC"] = "KeyC";
    ButtonCode["KeyD"] = "KeyD";
    ButtonCode["KeyE"] = "KeyE";
    ButtonCode["KeyF"] = "KeyF";
    ButtonCode["KeyG"] = "KeyG";
    ButtonCode["KeyH"] = "KeyH";
    ButtonCode["KeyI"] = "KeyI";
    ButtonCode["KeyJ"] = "KeyJ";
    ButtonCode["KeyK"] = "KeyK";
    ButtonCode["KeyL"] = "KeyL";
    ButtonCode["KeyM"] = "KeyM";
    ButtonCode["KeyN"] = "KeyN";
    ButtonCode["KeyO"] = "KeyO";
    ButtonCode["KeyP"] = "KeyP";
    ButtonCode["KeyQ"] = "KeyQ";
    ButtonCode["KeyR"] = "KeyR";
    ButtonCode["KeyS"] = "KeyS";
    ButtonCode["KeyT"] = "KeyT";
    ButtonCode["KeyU"] = "KeyU";
    ButtonCode["KeyV"] = "KeyV";
    ButtonCode["KeyW"] = "KeyW";
    ButtonCode["KeyX"] = "KeyX";
    ButtonCode["KeyY"] = "KeyY";
    ButtonCode["KeyZ"] = "KeyZ";
    ButtonCode["MetaLeft"] = "MetaLeft";
    ButtonCode["MetaRight"] = "MetaRight";
    ButtonCode["Numpad0"] = "Numpad0";
    ButtonCode["Numpad1"] = "Numpad1";
    ButtonCode["Numpad2"] = "Numpad2";
    ButtonCode["Numpad3"] = "Numpad3";
    ButtonCode["Numpad4"] = "Numpad4";
    ButtonCode["Numpad5"] = "Numpad5";
    ButtonCode["Numpad6"] = "Numpad6";
    ButtonCode["Numpad7"] = "Numpad7";
    ButtonCode["Numpad8"] = "Numpad8";
    ButtonCode["Numpad9"] = "Numpad9";
    ButtonCode["NumpadMultiply"] = "NumpadMultiply";
    ButtonCode["NumpadAdd"] = "NumpadAdd";
    ButtonCode["NumpadSubtract"] = "NumpadSubtract";
    ButtonCode["NumpadDecimal"] = "NumpadDecimal";
    ButtonCode["NumpadDivide"] = "NumpadDivide";
    ButtonCode["F1"] = "F1";
    ButtonCode["F2"] = "F2";
    ButtonCode["F3"] = "F3";
    ButtonCode["F4"] = "F4";
    ButtonCode["F5"] = "F5";
    ButtonCode["F6"] = "F6";
    ButtonCode["F7"] = "F7";
    ButtonCode["F8"] = "F8";
    ButtonCode["F9"] = "F9";
    ButtonCode["F10"] = "F10";
    ButtonCode["F11"] = "F11";
    ButtonCode["F12"] = "F12";
    ButtonCode["NumLock"] = "NumLock";
    ButtonCode["ScrollLock"] = "ScrollLock";
    ButtonCode["Semicolon"] = "Semicolon";
    ButtonCode["Equal"] = "Equal";
    ButtonCode["Comma"] = "Comma";
    ButtonCode["Minus"] = "Minus";
    ButtonCode["Period"] = "Period";
    ButtonCode["Slash"] = "Slash";
    ButtonCode["Backquote"] = "Backquote";
    ButtonCode["BracketLeft"] = "BracketLeft";
    ButtonCode["Backslash"] = "Backslash";
    ButtonCode["BracketRight"] = "BracketRight";
    ButtonCode["Quote"] = "Quote";
    ButtonCode["Mouse0"] = "Mouse0";
    ButtonCode["Mouse1"] = "Mouse1";
    ButtonCode["Mouse2"] = "Mouse2";
    ButtonCode["Mouse3"] = "Mouse3";
    ButtonCode["Mouse4"] = "Mouse4";
})(ButtonCode || (ButtonCode = {}));
const pressedBtnOrAndParse = (fn, ...keys) => {
    for (const key of keys) {
        if (Array.isArray(key)) {
            let allPressed = true;
            for (const k of key) {
                if (!fn(k)) {
                    allPressed = false;
                    break;
                }
            }
            if (allPressed)
                return true;
        }
        else {
            if (fn(key))
                return true;
        }
    }
    return false;
};
const tappedBtnOrAndParse = (data, ...keys) => {
    for (const key of keys) {
        if (Array.isArray(key)) {
            let allPressed = true;
            for (let i = 0; i < key.length; i++) {
                const k = key[i];
                const fn = (i === key.length - 1) ? data.isButtonTapped : data.isButtonPressed;
                if (!fn(k)) {
                    allPressed = false;
                    break;
                }
            }
            if (allPressed)
                return true;
        }
        else {
            if (data.isButtonTapped(key))
                return true;
        }
    }
    return false;
};
const releasedBtnOrAndParse = (data, ...keys) => {
    for (const key of keys) {
        if (Array.isArray(key)) {
            let allPressed = true;
            for (let i = 0; i < key.length; i++) {
                const k = key[i];
                const fn = (i === key.length - 1) ? data.isButtonReleased : data.isButtonPressed;
                if (!fn(k)) {
                    allPressed = false;
                    break;
                }
            }
            if (allPressed)
                return true;
        }
        else {
            if (data.isButtonReleased(key))
                return true;
        }
    }
    return false;
};
export class ControlHandler {
    #inputBlockingElements = new Array();
    #inputBlockerStates = new Array();
    // stores boolean values for the keys pressed
    #buttonPressedStates = new Map();
    get buttonPressedStates() {
        //		if (this.doInputWithoutMouse) return this.#buttonPressedStates;
        //		if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
        if (this.#inputblockersActive)
            return new Map();
        return this.#buttonPressedStates;
    }
    #buttonTappedStates = new Map();
    get buttonTappedStates() {
        //		if (this.doInputWithoutMouse) return this.#buttonTappedStates;
        //if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
        if (this.#inputblockersActive)
            return new Map();
        return this.#buttonTappedStates;
    }
    #buttonReleasedStates = new Map();
    get buttonReleasedStates() {
        //if (this.doInputWithoutMouse) return this.#buttonReleasedStates;
        //if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
        if (this.#inputblockersActive)
            return new Map();
        return this.#buttonReleasedStates;
    }
    // stores set of keycodes of buttons pressed currently
    #buttonsPressed = new Set();
    get buttonsPressed() {
        //if (this.doInputWithoutMouse) return this.#buttonsPressed;
        //if (!this.#mousedOver) return new Set<ButtonCodeStr>();
        if (this.#inputblockersActive)
            return new Set();
        return this.#buttonsPressed;
    }
    #buttonsTapped = new Set();
    get buttonsTapped() {
        //if (this.doInputWithoutMouse) return this.#buttonsTapped;
        //if (!this.#mousedOver) return new Set<ButtonCodeStr>();
        if (this.#inputblockersActive)
            return new Set();
        return this.#buttonsTapped;
    }
    #buttonsReleased = new Set();
    get buttonsReleased() {
        //if (this.doInputWithoutMouse) return this.#buttonsReleased;
        //if (!this.#mousedOver) return new Set<ButtonCodeStr>();
        if (this.#inputblockersActive)
            return new Set();
        return this.#buttonsReleased;
    }
    // stores methods/function that are used to retrieve translated control data
    #controlStates = new Map();
    #focusElement;
    #mousedOver = true;
    #isBlurred = false;
    get isBlurred() {
        return this.#isBlurred;
    }
    get isFocused() {
        return !this.#isBlurred;
    }
    // definitive mouse position relative to window
    #mouseX = null;
    #mouseY = null;
    #wheel = null;
    doInputWithoutMouse = true;
    constructor(focusElement = null) {
        this.#focusElement = focusElement;
        window.addEventListener("keydown", this.#keydown.bind(this));
        window.addEventListener("keyup", this.#keyup.bind(this));
        window.addEventListener("blur", this.#onBlur.bind(this));
        window.addEventListener("focus", this.#onFocus.bind(this));
        window.addEventListener("mousemove", this.#mousemove.bind(this));
        window.addEventListener("mouseup", this.#mouseup.bind(this));
        window.addEventListener("mousedown", this.#mousedown.bind(this));
        window.addEventListener("wheel", this.#onwheel.bind(this));
        if (focusElement) {
            this.#mousedOver = false;
            focusElement.onmouseover = () => {
                this.#mousedOver = true;
                this.#clearStates();
            };
            focusElement.onmouseout = () => {
                this.#mousedOver = false;
                this.#clearStates();
            };
        }
    }
    #clearStates() {
        this.#buttonPressedStates.clear();
        this.#buttonTappedStates.clear();
        this.#buttonReleasedStates.clear();
        this.#buttonsTapped.clear();
        this.#buttonsPressed.clear();
        this.#buttonsReleased.clear();
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
            pos.mouseY < 0 || pos.mouseY > rect.height || !this.#mousedOver) {
            this.#mousedOver = false;
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
        this.#buttonPressedStates.set(code, true);
        this.#buttonsPressed.add(code);
        this.#buttonsTapped.add(code);
        this.#buttonTappedStates.set(code, true);
    }
    #keyup(event) {
        const code = event.code;
        this.#buttonPressedStates.set(code, false);
        this.#buttonsPressed.delete(code);
        this.#buttonsReleased.add(code);
        this.#buttonReleasedStates.set(code, true);
    }
    // Unsetting keyboard events when user tabs away from window
    #onBlur() {
        this.#buttonPressedStates.forEach((pressed, key) => {
            this.#buttonPressedStates.set(key, false);
            this.#buttonsPressed.clear();
        });
        this.#mouseX = null;
        this.#mouseY = null;
        this.#mousedOver = false;
        this.#isBlurred = true;
    }
    #onFocus() {
        this.#isBlurred = false;
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
    #mouseup(event) {
        const state = `Mouse${event.button}`;
        this.#buttonPressedStates.set(state, false);
        this.#buttonsPressed.delete(state);
        this.#buttonReleasedStates.set(state, true);
        this.#buttonsReleased.add(state);
    }
    #mousedown(event) {
        const state = `Mouse${event.button}`;
        this.#buttonPressedStates.set(state, true);
        this.#buttonsPressed.add(state);
        this.#buttonTappedStates.set(state, true);
        this.#buttonsTapped.add(state);
    }
    #onwheel(event) {
        if (!this.#mousedOver)
            return;
        this.#wheel = (event.deltaY < 0) ? -1 : (event.deltaY > 0) ? 1 : 0;
    }
    /**
     * Adds a control state, where you provide a handler function that returns either a boolean or number
     *
     * EX: providing a control state "STRAFE" that determines its value from whether KeyA or KeyD is pressed
     * */
    addControlState(controlStateName, mapping) {
        this.#controlStates.set(controlStateName, mapping);
        return () => mapping(this.mappingData);
    }
    /** Adds a simple button that determines if buttons are being pressed. Providing
     * button codes individually induces "or" logic. Passing them in an array induces "and"
     * logic.
     *
     * If you wanted to set a keybind to be either w or space + up-arrow, heres how:
     * @example
     * addSimpleButton("Up Controls", "KeyW", ["ArrowUp", "Space"]);
     */
    addPressedButton(controlStateName, ...keys) {
        const mapping = (data) => {
            return pressedBtnOrAndParse(data.isButtonPressed, ...keys);
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => { return this.getControlValueBool(controlStateName); };
    }
    addTappedButton(controlStateName, ...keys) {
        const mapping = (data) => {
            return tappedBtnOrAndParse(data, ...keys);
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => { return this.getControlValueBool(controlStateName); };
    }
    addReleasedButton(controlStateName, ...keys) {
        const mapping = (data) => {
            return releasedBtnOrAndParse(data, ...keys);
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => { return this.getControlValueBool(controlStateName); };
    }
    /** Adds a one dimenensional "axis". Follows the and or logic for the buttons you provide.
     *
     * @example
     * add1DAxis("Throttle", {pos: "KeyW", neg: "KeyS"})
     * // this would be 1 when W is pressed, and -1 when S is pressed. 0 when both
     */
    add1DAxis(controlStateName, keys) {
        const mapping = (data) => {
            const pos = pressedBtnOrAndParse(data.isButtonPressed, ...keys.pos);
            const neg = pressedBtnOrAndParse(data.isButtonPressed, ...keys.neg);
            return +pos - +neg;
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => this.getControlValueNumber(controlStateName);
    }
    /** Adds a movement controller. Follows the same "and" "or" logic that "addSimpleButton" does
     * for each direction provided. The control state will return an array containing deltaX and deltaY
     * where right is subtracted by left, and up is subtracted by down
     *
     * @example
     * addControlVector("Movement", {left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"], up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"]});
     *
     * */
    addMovementController(controlStateName, keys) {
        const mapping = (data) => {
            const left = pressedBtnOrAndParse(data.isButtonPressed, ...keys.left);
            const right = pressedBtnOrAndParse(data.isButtonPressed, ...keys.right);
            const up = pressedBtnOrAndParse(data.isButtonPressed, ...keys.up);
            const down = pressedBtnOrAndParse(data.isButtonPressed, ...keys.down);
            return [+right - +left, +up - +down];
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => this.getControlValue2dNumber(controlStateName);
    }
    /** Adds a simple mouse handler. Depending if you set a focus element, the mouse position
     * will be set to NaN if offscreen. Be wary...
     * @example
     * addMouseHandler("MousePosition");
     */
    addMouseHandler(controlStateName) {
        const mapping = (data) => {
            const mouseX = (data.mouseX) ? data.mouseX : NaN;
            const mouseY = (data.mouseY) ? data.mouseY : NaN;
            return [mouseX, mouseY];
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => this.getControlValue2dNumber(controlStateName);
    }
    addWheelHandler(controlStateName) {
        const mapping = (data) => {
            return (data.wheel) ? data.wheel : 0;
        };
        this.#controlStates.set(controlStateName, mapping);
        return () => this.getControlValueNumber(controlStateName);
    }
    get mappingData() {
        const mousePos = this.#getMousePosition();
        return {
            buttonsPressed: this.buttonsPressed,
            buttonsTapped: this.buttonsTapped,
            buttonsReleased: this.buttonsReleased,
            isButtonPressed: (key) => {
                const value = this.buttonPressedStates.get(key);
                return (value === undefined) ? false : value;
            },
            isButtonTapped: (key) => {
                const value = this.buttonTappedStates.get(key);
                return (value === undefined) ? false : value;
            },
            isButtonReleased: (key) => {
                const value = this.buttonReleasedStates.get(key);
                return (value === undefined) ? false : value;
            },
            mouseX: mousePos.mouseX,
            mouseY: mousePos.mouseY,
            wheel: this.#wheel
        };
    }
    /**
    * Gets the current state of a control state. Control states are created with "addControlState"
    */
    getControlValue(name) {
        const mapping = this.#controlStates.get(name);
        if (!mapping)
            throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist`);
        /*const mousePos = */ this.#getMousePosition();
        return mapping(this.mappingData);
    }
    getControlValueBool(name) {
        const value = this.getControlValue(name);
        if (typeof value === 'boolean')
            return value;
        throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist`);
    }
    getControlValueNumber(name) {
        const value = this.getControlValue(name);
        if (typeof value === 'boolean')
            return +value;
        if (typeof value !== 'number')
            throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist or is wrong type`);
        return value;
    }
    getControlValue2dNumber(name) {
        const value = this.getControlValue(name);
        if (!Array.isArray(value))
            throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist or is wrong type`);
        return value;
    }
    /**
    * Function which allows for is key tapped and is key released to work properlly. Ideally put
    * at the end of your game loop
    */
    tick() {
        this.#buttonsTapped.clear();
        this.#buttonTappedStates.forEach((_, key) => {
            this.#buttonTappedStates.set(key, false);
        });
        this.#buttonsReleased.clear();
        this.#buttonReleasedStates.forEach((_, key) => {
            this.#buttonReleasedStates.set(key, false);
        });
        this.#wheel = 0;
    }
    get #inputblockersActive() {
        for (const state of this.#inputBlockerStates) {
            if (state)
                return state;
        }
        return false;
    }
    addInputBlockingElement(element) {
        const index = this.#inputBlockingElements.length;
        this.#inputBlockingElements.push(element);
        this.#inputBlockerStates.push(false);
        this.#inputBlockingElements[index].onmouseover = () => {
            this.#clearStates();
            this.#inputBlockerStates[index] = true;
        };
        this.#inputBlockingElements[index].onmouseout = () => {
            this.#clearStates();
            this.#inputBlockerStates[index] = false;
        };
    }
}
