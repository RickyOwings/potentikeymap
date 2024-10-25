enum KeyCode {
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
}

type KeyCodeStr = `${KeyCode}`;

interface MappingData {
	keysPressed: Set<KeyCodeStr>, 
	isKeyPressed: (key: KeyCodeStr) => boolean,
	mouseX: number | null,
	mouseY: number | null,
	mouse0: boolean,
	mouse1: boolean,
	mouse2: boolean,
	mouse3: boolean,
	mouse4: boolean,
}

export class ControlHandler {

	// stores boolean values for the keys pressed
	#keyStates = new Map<KeyCodeStr, boolean>();

	// stores set of keycodes of buttons pressed currently
	#keysPressed = new Set<KeyCodeStr>();
	#keysTapped = new Set<KeyCodeStr>();
	#keysReleased = new Set<KeyCodeStr>();

	// stores methods/function that are used to retrieve translated control data
	#controlStates = new Map<string, (data: MappingData) => boolean | number | number[]>();

	#focusElement: HTMLElement | null;

	// definitive mouse position relative to window
	#mouseX: number | null = null;
	#mouseY: number | null = null;

	#mouse0: boolean = false;
	#mouse1: boolean = false;
	#mouse2: boolean = false;
	#mouse3: boolean = false;
	#mouse4: boolean = false;

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
		const code = event.code as KeyCodeStr;
		this.#keyStates.set(code, true);
		this.#keysPressed.add(code);
		this.#keysTapped.add(code);
	}

	#keyup(event: KeyboardEvent) {
		const code = event.code as KeyCodeStr;
		this.#keyStates.set(code, false);
		this.#keysPressed.delete(code);
		this.#keysReleased.add(code);
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
		switch(event.button) {
			case 0: this.#mouse0 = false; break;
			case 1: this.#mouse1 = false; break;
			case 2: this.#mouse2 = false; break;
			case 3: this.#mouse3 = false; break;
			case 4: this.#mouse4 = false; break;
		}
	}

	#mousedown(event: MouseEvent) {
		switch(event.button) {
			case 0: this.#mouse0 = true; break;
			case 1: this.#mouse1 = true; break;
			case 2: this.#mouse2 = true; break;
			case 3: this.#mouse3 = true; break;
			case 4: this.#mouse4 = true; break;
		}
	}

	/**
	 * Adds a control state, where you provide a handler function that returns either a boolean or number
	 *
	 * EX: providing a control state "STRAFE" that determines its value from whether KeyA or KeyD is pressed
	 * */
	addControlState(name: string, mapping: (data: MappingData) => boolean | number | number[]) {
		this.#controlStates.set(name, mapping);
	}

	/**
	* Gets the current state of a control state. Control states are created with "addControlState"
	*/
	getControlValue(name: string): boolean | number | number[] {
		const mapping = this.#controlStates.get(name);
		if (mapping === undefined) throw `Cannot access the control "${name}" since it hasn't been defined!`;

		const mousePos = this.#getMousePosition();

		return mapping({
			keysPressed: this.#keysPressed,
			isKeyPressed: (key: KeyCodeStr) => {
				const value = this.#keyStates.get(key);
				return (value === undefined) ? false : value;
			},
			mouseX: mousePos.mouseX,
			mouseY: mousePos.mouseY,
			mouse0: this.#mouse0,
			mouse1: this.#mouse1,
			mouse2: this.#mouse2,
			mouse3: this.#mouse3,
			mouse4: this.#mouse4,
		});
	}

	/**
	* Function which allows for is key tapped and is key released to work properlly. Ideally put
	* at the end of your game loop
	*/
	tick() {
		this.#keysTapped.clear();
		this.#keysReleased.clear();
	}
}
