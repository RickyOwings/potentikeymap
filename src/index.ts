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
	isKeyTapped: (key: KeyCodeStr) => boolean,
	isKeyReleased: (key: KeyCodeStr) => boolean,
	mouseX: number | null,
	mouseY: number | null,

	mouse0Pressed: boolean,
	mouse1Pressed: boolean,
	mouse2Pressed: boolean,
	mouse3Pressed: boolean,
	mouse4Pressed: boolean,

	mouse0Tapped: boolean,
	mouse1Tapped: boolean,
	mouse2Tapped: boolean,
	mouse3Tapped: boolean,
	mouse4Tapped: boolean,

	mouse0Released: boolean,
	mouse1Released: boolean,
	mouse2Released: boolean,
	mouse3Released: boolean,
	mouse4Released: boolean,


}

export class ControlHandler {

	// stores boolean values for the keys pressed
	#keyPressedStates = new Map<KeyCodeStr, boolean>();
	#keyTappedStates = new Map<KeyCodeStr, boolean>();
	#keyReleasedStates = new Map<KeyCodeStr, boolean>();

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

	#mouse0Pressed: boolean = false;
	#mouse1Pressed: boolean = false;
	#mouse2Pressed: boolean = false;
	#mouse3Pressed: boolean = false;
	#mouse4Pressed: boolean = false;

	#mouse0Tapped: boolean = false;
	#mouse1Tapped: boolean = false;
	#mouse2Tapped: boolean = false;
	#mouse3Tapped: boolean = false;
	#mouse4Tapped: boolean = false;

	#mouse0Released: boolean = false;
	#mouse1Released: boolean = false;
	#mouse2Released: boolean = false;
	#mouse3Released: boolean = false;
	#mouse4Released: boolean = false;

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
		this.#keyPressedStates.set(code, true);
		this.#keysPressed.add(code);

		this.#keysTapped.add(code);
		this.#keyTappedStates.set(code, true);
	}

	#keyup(event: KeyboardEvent) {
		const code = event.code as KeyCodeStr;
		this.#keyPressedStates.set(code, false);
		this.#keysPressed.delete(code);

		this.#keysReleased.add(code);
		this.#keyReleasedStates.set(code, true);
	}

	// Unsetting keyboard events when user tabs away from window
	#onBlur() {
		this.#keyPressedStates.forEach((pressed, key) => {
			this.#keyPressedStates.set(key, false);
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
			case 0: { 
				this.#mouse0Pressed = false;
				this.#mouse0Released = true;
			} break;
			case 1: { 
				this.#mouse1Pressed = false;
				this.#mouse1Released = true;
			} break;
			case 2: { 
				this.#mouse2Pressed = false;
				this.#mouse2Released = true;
			} break;
			case 3: { 
				this.#mouse3Pressed = false;
				this.#mouse3Released = true;
			} break;
			case 4: { 
				this.#mouse4Pressed = false;
				this.#mouse4Released = true;
			} break;
		}
	}

	#mousedown(event: MouseEvent) {
		switch(event.button) {
			case 0: { 
				this.#mouse0Pressed = true;
				this.#mouse0Tapped = true;
			} break;
			case 1: { 
				this.#mouse1Pressed = true;
				this.#mouse1Tapped = true;
			} break;
			case 2: { 
				this.#mouse2Pressed = true;
				this.#mouse2Tapped = true;
			} break;
			case 3: { 
				this.#mouse3Pressed = true;
				this.#mouse3Tapped = true;
			} break;
			case 4: { 
				this.#mouse4Pressed = true;
				this.#mouse4Tapped = true;
			} break;
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
				const value = this.#keyPressedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isKeyTapped: (key: KeyCodeStr) => {
				const value = this.#keyTappedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isKeyReleased: (key: KeyCodeStr) => {
				const value = this.#keyReleasedStates.get(key);
				return (value === undefined) ? false : value;
			},
			mouseX: mousePos.mouseX,
			mouseY: mousePos.mouseY,

			mouse0Pressed: this.#mouse0Pressed,
			mouse1Pressed: this.#mouse1Pressed,
			mouse2Pressed: this.#mouse2Pressed,
			mouse3Pressed: this.#mouse3Pressed,
			mouse4Pressed: this.#mouse4Pressed,

			mouse0Tapped: this.#mouse0Tapped,
			mouse1Tapped: this.#mouse1Tapped,
			mouse2Tapped: this.#mouse2Tapped,
			mouse3Tapped: this.#mouse3Tapped,
			mouse4Tapped: this.#mouse4Tapped,

			mouse0Released: this.#mouse0Released,
			mouse1Released: this.#mouse1Released,
			mouse2Released: this.#mouse2Released,
			mouse3Released: this.#mouse3Released,
			mouse4Released: this.#mouse4Released,

		});
	}

	/**
	* Function which allows for is key tapped and is key released to work properlly. Ideally put
	* at the end of your game loop
	*/
	tick() {
		this.#keysTapped.clear();
		
		this.#keyTappedStates.forEach((_, key) => {
			this.#keyTappedStates.set(key, false);
		})

		this.#keysReleased.clear();

		this.#keyReleasedStates.forEach((_, key) => {
			this.#keyReleasedStates.set(key, false);
		});
		
		this.#mouse0Tapped = false;
		this.#mouse1Tapped = false;
		this.#mouse2Tapped = false;
		this.#mouse3Tapped = false;
		this.#mouse4Tapped = false;

		this.#mouse0Released = false;
		this.#mouse1Released = false;
		this.#mouse2Released = false;
		this.#mouse3Released = false;
		this.#mouse4Released = false;
	}
}
