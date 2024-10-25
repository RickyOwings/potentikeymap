enum ButtonCode {
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
	Mouse4 = "Mouse4",
}

type ButtonCodeStr = `${ButtonCode}`;

interface MappingData {
	keysPressed: Set<ButtonCodeStr>, 
	isButtonPressed: (key: ButtonCodeStr) => boolean,
	isButtonTapped: (key: ButtonCodeStr) => boolean,
	isButtonReleased: (key: ButtonCodeStr) => boolean,
	mouseX: number | null,
	mouseY: number | null,

}

type ButtonAndOr = ButtonCodeStr | ButtonCodeStr[];

const traverseButtonOrAndArray = (data: MappingData, ...keys: ButtonAndOr[]) => {
	for(const key of keys) {
		if (Array.isArray(key)) {
			let allPressed = true;
			for(const k of key) {
				if (!data.isButtonPressed(k)) {
					allPressed = false; break;
				}
			}
			if (allPressed) return true;
		} else {
			if (data.isButtonPressed(key)) return true;
		}
	}	
	return false;
}

export class ControlHandler {

	// stores boolean values for the keys pressed
	#buttonPressedStates = new Map<ButtonCodeStr, boolean>();
	#buttonTappedStates = new Map<ButtonCodeStr, boolean>();
	#buttonReleasedStates = new Map<ButtonCodeStr, boolean>();

	// stores set of keycodes of buttons pressed currently
	#buttonsPressed = new Set<ButtonCodeStr>();
	#buttonsTapped = new Set<ButtonCodeStr>();
	#buttonsReleased = new Set<ButtonCodeStr>();

	// stores methods/function that are used to retrieve translated control data
	#controlStates = new Map<string, (data: MappingData) => boolean | number | number[]>();

	#focusElement: HTMLElement | null;

	// definitive mouse position relative to window
	#mouseX: number | null = null;
	#mouseY: number | null = null;

	constructor(focusElement: HTMLElement | null = null) {

		this.#focusElement = focusElement;

		window.addEventListener("keydown", this.#keydown.bind(this));
		window.addEventListener("keyup", this.#keyup.bind(this));
		window.addEventListener("blur", this.#onBlur.bind(this));
		window.addEventListener("mousemove", this.#mousemove.bind(this));
		window.addEventListener("mouseup", this.#mouseup.bind(this));
		window.addEventListener("mousedown", this.#mousedown.bind(this));
	}

	#getMousePosition() {
		if (
			this.#focusElement === null || 
			this.#mouseX === null || 
			this.#mouseY === null
		) return {mouseX: this.#mouseX, mouseY: this.#mouseY};
		const rect = this.#focusElement.getBoundingClientRect();

		const pos = {
			mouseX: this.#mouseX - rect.x, mouseY: this.#mouseY - rect.y
		};

		if (
			pos.mouseX < 0 || pos.mouseX > rect.width ||
			pos.mouseY < 0 || pos.mouseY > rect.height
		) {
			return {mouseX: null, mouseY: null};
		}

		if (this.#focusElement instanceof HTMLCanvasElement) {
			pos.mouseX *= this.#focusElement.width / rect.width;	
			pos.mouseY *= this.#focusElement.height / rect.height;	
		}

		return pos;
	}

	#keydown(event: KeyboardEvent) {
		const code = event.code as ButtonCodeStr;
		this.#buttonPressedStates.set(code, true);
		this.#buttonsPressed.add(code);

		this.#buttonsTapped.add(code);
		this.#buttonTappedStates.set(code, true);
	}

	#keyup(event: KeyboardEvent) {
		const code = event.code as ButtonCodeStr;
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
	}

	#mousemove(event: MouseEvent) {
		if (this.#focusElement === null) {
			this.#mouseX = event.clientX;
			this.#mouseY = event.clientY;
			return;
		}

		this.#mouseX = event.clientX;
		this.#mouseY = event.clientY;
	}

	#mouseup(event: MouseEvent) {
		const state = `Mouse${event.button}` as ButtonCode;

		this.#buttonPressedStates.set(state, false);
		this.#buttonsPressed.delete(state);

		this.#buttonReleasedStates.set(state, true);
		this.#buttonsReleased.add(state);

	}

	#mousedown(event: MouseEvent) {
		const state = `Mouse${event.button}` as ButtonCode;

		this.#buttonPressedStates.set(state, true);
		this.#buttonsPressed.add(state);

		this.#buttonTappedStates.set(state, true);
		this.#buttonsTapped.add(state);
	}

	/**
	 * Adds a control state, where you provide a handler function that returns either a boolean or number
	 *
	 * EX: providing a control state "STRAFE" that determines its value from whether KeyA or KeyD is pressed
	 * */
	addControlState(name: string, mapping: (data: MappingData) => boolean | number | number[]) {
		this.#controlStates.set(name, mapping);
	}

	/** Adds a simple button that determines if buttons are being pressed. Providing 
	 * button codes individually induces "or" logic. Passing them in an array induces "and"
	 * logic. 
	 *
	 * If you wanted to set a keybind to be either w or space + up-arrow, heres how:
	 * @example
	 * addSimpleButton("Up Controls", "KeyW", ["ArrowUp", "Space"]);
	 */
	addSimpleButton(controlStateName: string, ...keys: ButtonAndOr[]) {
		const mapping = (data: MappingData) => {
			return traverseButtonOrAndArray(data, ...keys);	
		}
		this.#controlStates.set(controlStateName, mapping);
	}

	/** Adds a one dimenensional "axis". Follows the and or logic for the buttons you provide.
	 *
	 * @example
	 * add1DAxis("Throttle", {pos: "KeyW", neg: "KeyS"})
	 * // this would be 1 when W is pressed, and -1 when S is pressed. 0 when both
	 */
	add1DAxis(controlStateName: string, keys: {pos: ButtonAndOr[], neg: ButtonAndOr[]}) {
		const mapping = (data: MappingData) => {
			const pos = traverseButtonOrAndArray(data, ...keys.pos);
			const neg = traverseButtonOrAndArray(data, ...keys.neg);
			return +pos - +neg;
		}
		this.#controlStates.set(controlStateName, mapping);
	}

	/** Adds a movement controller. Follows the same "and" "or" logic that "addSimpleButton" does
	 * for each direction provided. The control state will return an array containing deltaX and deltaY 
	 * where right is subtracted by left, and up is subtracted by down
	 *
	 * @example
	 * addControlVector("Movement", {left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"], up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"]});
	 *
	 * */
	addMovementController(controlStateName: string, keys: {left: ButtonAndOr[], right: ButtonAndOr[], up: ButtonAndOr[], down: ButtonAndOr[]}) {
		const mapping = (data: MappingData) => {
			const left = traverseButtonOrAndArray(data, ...keys.left);
			const right = traverseButtonOrAndArray(data, ...keys.right);
			const up = traverseButtonOrAndArray(data, ...keys.up);
			const down = traverseButtonOrAndArray(data, ...keys.down);
			return [+right - +left, +up - +down];
		}
		this.#controlStates.set(controlStateName, mapping);
	}

	/** Adds a simple mouse handler. Depending if you set a focus element, the mouse position
	 * will be set to NaN if offscreen. Be wary...
	 * @example
	 * addMouseHandler("MousePosition");
	 */
	addMouseHandler(controlStateName: string) {
		const mapping = (data: MappingData) => {
			const mouseX = (data.mouseX) ? data.mouseX : NaN;
			const mouseY = (data.mouseY) ? data.mouseY : NaN;
			return [mouseX, mouseY];
		}
		this.#controlStates.set(controlStateName, mapping);
	}

	/**
	* Gets the current state of a control state. Control states are created with "addControlState"
	*/
	getControlValue(name: string): boolean | number | number[] {
		const mapping = this.#controlStates.get(name);
		if (mapping === undefined) throw `Cannot access the control "${name}" since it hasn't been defined!`;

		const mousePos = this.#getMousePosition();

		return mapping({
			keysPressed: this.#buttonsPressed,
			isButtonPressed: (key: ButtonCodeStr) => {
				const value = this.#buttonPressedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isButtonTapped: (key: ButtonCodeStr) => {
				const value = this.#buttonTappedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isButtonReleased: (key: ButtonCodeStr) => {
				const value = this.#buttonReleasedStates.get(key);
				return (value === undefined) ? false : value;
			},
			mouseX: mousePos.mouseX,
			mouseY: mousePos.mouseY,
		});
	}

	/**
	* Function which allows for is key tapped and is key released to work properlly. Ideally put
	* at the end of your game loop
	*/
	tick() {
		this.#buttonsTapped.clear();
		
		this.#buttonTappedStates.forEach((_, key) => {
			this.#buttonTappedStates.set(key, false);
		})

		this.#buttonsReleased.clear();

		this.#buttonReleasedStates.forEach((_, key) => {
			this.#buttonReleasedStates.set(key, false);
		});
		
	}
}
