declare enum ButtonCode {
    Backspace = "Backspace",
    Tab = "Tab",
    Enter = "Enter",
    ShiftLeft = "ShiftLeft",
    ShiftRight = "ShiftRight",
    ControlLeft = "ControlLeft",
    ControlRight = "ControlRight",
    AltLeft = "AltLeft",
    AltRight = "AltRight",
    Pause = "Pause",
    CapsLock = "CapsLock",
    Escape = "Escape",
    Space = "Space",
    PageUp = "PageUp",
    PageDown = "PageDown",
    End = "End",
    Home = "Home",
    ArrowLeft = "ArrowLeft",
    ArrowUp = "ArrowUp",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    PrintScreen = "PrintScreen",
    Insert = "Insert",
    Delete = "Delete",
    Digit0 = "Digit0",
    Digit1 = "Digit1",
    Digit2 = "Digit2",
    Digit3 = "Digit3",
    Digit4 = "Digit4",
    Digit5 = "Digit5",
    Digit6 = "Digit6",
    Digit7 = "Digit7",
    Digit8 = "Digit8",
    Digit9 = "Digit9",
    KeyA = "KeyA",
    KeyB = "KeyB",
    KeyC = "KeyC",
    KeyD = "KeyD",
    KeyE = "KeyE",
    KeyF = "KeyF",
    KeyG = "KeyG",
    KeyH = "KeyH",
    KeyI = "KeyI",
    KeyJ = "KeyJ",
    KeyK = "KeyK",
    KeyL = "KeyL",
    KeyM = "KeyM",
    KeyN = "KeyN",
    KeyO = "KeyO",
    KeyP = "KeyP",
    KeyQ = "KeyQ",
    KeyR = "KeyR",
    KeyS = "KeyS",
    KeyT = "KeyT",
    KeyU = "KeyU",
    KeyV = "KeyV",
    KeyW = "KeyW",
    KeyX = "KeyX",
    KeyY = "KeyY",
    KeyZ = "KeyZ",
    MetaLeft = "MetaLeft",
    MetaRight = "MetaRight",
    Numpad0 = "Numpad0",
    Numpad1 = "Numpad1",
    Numpad2 = "Numpad2",
    Numpad3 = "Numpad3",
    Numpad4 = "Numpad4",
    Numpad5 = "Numpad5",
    Numpad6 = "Numpad6",
    Numpad7 = "Numpad7",
    Numpad8 = "Numpad8",
    Numpad9 = "Numpad9",
    NumpadMultiply = "NumpadMultiply",
    NumpadAdd = "NumpadAdd",
    NumpadSubtract = "NumpadSubtract",
    NumpadDecimal = "NumpadDecimal",
    NumpadDivide = "NumpadDivide",
    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    F11 = "F11",
    F12 = "F12",
    NumLock = "NumLock",
    ScrollLock = "ScrollLock",
    Semicolon = "Semicolon",
    Equal = "Equal",
    Comma = "Comma",
    Minus = "Minus",
    Period = "Period",
    Slash = "Slash",
    Backquote = "Backquote",
    BracketLeft = "BracketLeft",
    Backslash = "Backslash",
    BracketRight = "BracketRight",
    Quote = "Quote",
    Mouse0 = "Mouse0",
    Mouse1 = "Mouse1",
    Mouse2 = "Mouse2",
    Mouse3 = "Mouse3",
    Mouse4 = "Mouse4"
}
type ButtonCodeStr = `${ButtonCode}`;
type MappingData = ControlHandler['mappingData'];
type ButtonAndOr = ButtonCodeStr | ButtonCodeStr[];
export declare class ControlHandler {
    #private;
    private get buttonPressedStates();
    private get buttonTappedStates();
    private get buttonReleasedStates();
    private get buttonsPressed();
    private get buttonsTapped();
    private get buttonsReleased();
    get isBlurred(): boolean;
    get isFocused(): boolean;
    doInputWithoutMouse: boolean;
    constructor(focusElement?: HTMLElement | null);
    /**
     * Adds a control state, where you provide a handler function that returns either a boolean or number
     *
     * EX: providing a control state "STRAFE" that determines its value from whether KeyA or KeyD is pressed
     * */
    addControlState(controlStateName: string, mapping: (data: MappingData) => boolean | number | number[]): () => boolean | number | number[] | undefined;
    /** Adds a simple button that determines if buttons are being pressed. Providing
     * button codes individually induces "or" logic. Passing them in an array induces "and"
     * logic.
     *
     * If you wanted to set a keybind to be either w or space + up-arrow, heres how:
     * @example
     * addSimpleButton("Up Controls", "KeyW", ["ArrowUp", "Space"]);
     */
    addPressedButton(controlStateName: string, ...keys: ButtonAndOr[]): () => boolean;
    addTappedButton(controlStateName: string, ...keys: ButtonAndOr[]): () => boolean;
    addReleasedButton(controlStateName: string, ...keys: ButtonAndOr[]): () => boolean;
    /** Adds a one dimenensional "axis". Follows the and or logic for the buttons you provide.
     *
     * @example
     * add1DAxis("Throttle", {pos: "KeyW", neg: "KeyS"})
     * // this would be 1 when W is pressed, and -1 when S is pressed. 0 when both
     */
    add1DAxis(controlStateName: string, keys: {
        pos: ButtonAndOr[];
        neg: ButtonAndOr[];
    }): () => number;
    /** Adds a movement controller. Follows the same "and" "or" logic that "addSimpleButton" does
     * for each direction provided. The control state will return an array containing deltaX and deltaY
     * where right is subtracted by left, and up is subtracted by down
     *
     * @example
     * addControlVector("Movement", {left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"], up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"]});
     *
     * */
    addMovementController(controlStateName: string, keys: {
        left: ButtonAndOr[];
        right: ButtonAndOr[];
        up: ButtonAndOr[];
        down: ButtonAndOr[];
    }): () => number[];
    /** Adds a simple mouse handler. Depending if you set a focus element, the mouse position
     * will be set to NaN if offscreen. Be wary...
     * @example
     * addMouseHandler("MousePosition");
     */
    addMouseHandler(controlStateName: string): () => number[];
    addWheelHandler(controlStateName: string): () => number;
    private get mappingData();
    /**
    * Gets the current state of a control state. Control states are created with "addControlState"
    */
    getControlValue(name: string): boolean | number | number[];
    getControlValueBool(name: string): boolean;
    getControlValueNumber(name: string): number;
    getControlValue2dNumber(name: string): number[];
    /**
    * Function which allows for is key tapped and is key released to work properlly. Ideally put
    * at the end of your game loop
    */
    tick(): void;
    addInputBlockingElement(element: HTMLElement): void;
}
export {};
