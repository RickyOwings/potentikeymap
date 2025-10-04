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

/*interface MappingData {
	buttonsPressed: Set<ButtonCodeStr>, 
	isButtonPressed: (key: ButtonCodeStr) => boolean,
	isButtonTapped: (key: ButtonCodeStr) => boolean,
	isButtonReleased: (key: ButtonCodeStr) => boolean,
	mouseX: number | null,
	mouseY: number | null,
	wheel: number | null,
}*/
type MappingData = ControlHandler['mappingData']

type ButtonAndOr = ButtonCodeStr | ButtonCodeStr[];

type ButtonMapFn = (key: ButtonCodeStr) => boolean;

const pressedBtnOrAndParse = (fn: ButtonMapFn, ...keys: ButtonAndOr[]) => {
	for(const key of keys) {
		if (Array.isArray(key)) {
			let allPressed = true;
			for(const k of key) {
				if (!fn(k)) {
					allPressed = false; break;
				}
			}
			if (allPressed) return true;
		} else {
			if (fn(key)) return true;
		}
	}	
	return false;
}

const tappedBtnOrAndParse = (data: MappingData, ...keys: ButtonAndOr[]) => {
	for(const key of keys) {
		if (Array.isArray(key)) {
			let allPressed = true;
			for(let i = 0; i < key.length; i++) {
				const k = key[i];
				const fn = (i === key.length - 1) ? data.isButtonTapped : data.isButtonPressed;
				if (!fn(k)) {
					allPressed = false; break;
				}
			}
			if (allPressed) return true;
		} else {
			if (data.isButtonTapped(key)) return true;
		}
	}
	return false;
}


const releasedBtnOrAndParse = (data: MappingData, ...keys: ButtonAndOr[]) => {
	for(const key of keys) {
		if (Array.isArray(key)) {
			let allPressed = true;
			for(let i = 0; i < key.length; i++) {
				const k = key[i];
				const fn = (i === key.length - 1) ? data.isButtonReleased : data.isButtonPressed;
				if (!fn(k)) {
					allPressed = false; break;
				}
			}
			if (allPressed) return true;
		} else {
			if (data.isButtonReleased(key)) return true;
		}
	}
	return false;
}

export class ControlHandler {

	#inputBlockingElements = new Array<HTMLElement>();
	#inputBlockerStates = new Array<boolean>();

	// stores boolean values for the keys pressed
	#buttonPressedStates = new Map<ButtonCodeStr, boolean>();

	private get buttonPressedStates () {
//		if (this.doInputWithoutMouse) return this.#buttonPressedStates;
//		if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
		if (this.#inputblockersActive) return new Map<ButtonCodeStr, boolean>();
		return this.#buttonPressedStates;
	}
	
	#buttonTappedStates = new Map<ButtonCodeStr, boolean>();

	private get buttonTappedStates () {
//		if (this.doInputWithoutMouse) return this.#buttonTappedStates;
		//if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
		if (this.#inputblockersActive) return new Map<ButtonCodeStr, boolean>();
		return this.#buttonTappedStates;
	}

	#buttonReleasedStates = new Map<ButtonCodeStr, boolean>();

	private get buttonReleasedStates () {
		//if (this.doInputWithoutMouse) return this.#buttonReleasedStates;
		//if (!this.#mousedOver) return new Map<ButtonCodeStr, boolean>();
		if (this.#inputblockersActive) return new Map<ButtonCodeStr, boolean>();
		return this.#buttonReleasedStates;
	}

	// stores set of keycodes of buttons pressed currently
	#buttonsPressed = new Set<ButtonCodeStr>();
	private get buttonsPressed () {
		//if (this.doInputWithoutMouse) return this.#buttonsPressed;
		//if (!this.#mousedOver) return new Set<ButtonCodeStr>();
		if (this.#inputblockersActive) return new Set<ButtonCodeStr>();
		return this.#buttonsPressed;
	}

	#buttonsTapped = new Set<ButtonCodeStr>();

	private get buttonsTapped() {
		//if (this.doInputWithoutMouse) return this.#buttonsTapped;
		//if (!this.#mousedOver) return new Set<ButtonCodeStr>();
		if (this.#inputblockersActive) return new Set<ButtonCodeStr>();
		return this.#buttonsTapped;
	}

	#buttonsReleased = new Set<ButtonCodeStr>();

	private get buttonsReleased() {
		//if (this.doInputWithoutMouse) return this.#buttonsReleased;
		//if (!this.#mousedOver) return new Set<ButtonCodeStr>();
		if (this.#inputblockersActive) return new Set<ButtonCodeStr>();
		return this.#buttonsReleased;
	}

	// stores methods/function that are used to retrieve translated control data
	#controlStates = new Map<string, (data: MappingData) => boolean | number | number[]>();

	#focusElement: HTMLElement | null;
	#mousedOver: boolean = true;

	#isBlurred = false;

	get isBlurred () {
		return this.#isBlurred;
	}

	get isFocused () {
		return !this.#isBlurred;
	}

	// definitive mouse position relative to window
	#mouseX: number | null = null;
	#mouseY: number | null = null;

	#wheel: number | null = null;

	doInputWithoutMouse = true;

	constructor(focusElement: HTMLElement | null = null) {

		this.#focusElement = focusElement;

		window.addEventListener("keydown", this.#keydown.bind(this));
		window.addEventListener("keyup", this.#keyup.bind(this));
		window.addEventListener("blur", this.#onBlur.bind(this));
		window.addEventListener("focus", this.#onFocus.bind(this))
		window.addEventListener("mousemove", this.#mousemove.bind(this));
		window.addEventListener("mouseup", this.#mouseup.bind(this));
		window.addEventListener("mousedown", this.#mousedown.bind(this));
		window.addEventListener("wheel", this.#onwheel.bind(this));

		if (focusElement) {
			this.#mousedOver = false;
			focusElement.onmouseover = () => {
				this.#mousedOver = true;
				this.#clearStates();
			}
			focusElement.onmouseout = () => {
				this.#mousedOver = false;
				this.#clearStates();
			}
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
			pos.mouseY < 0 || pos.mouseY > rect.height || !this.#mousedOver
		) {
			this.#mousedOver = false;
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
		this.#mousedOver = false;
		this.#isBlurred = true;
	}

	#onFocus() {
		this.#isBlurred = false;
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

	#onwheel(event: WheelEvent) {
		if (!this.#mousedOver) return;
	
		this.#wheel = (event.deltaY < 0) ? -1 : (event.deltaY > 0) ? 1 : 0;
	}

	/**
	 * Adds a control state, where you provide a handler function that returns either a boolean or number
	 *
	 * EX: providing a control state "STRAFE" that determines its value from whether KeyA or KeyD is pressed
	 * */
	addControlState(controlStateName: string, mapping: (data: MappingData) => boolean | number | number[]): () => boolean | number | number[] | undefined {
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
	addPressedButton(controlStateName: string, ...keys: ButtonAndOr[]) {
		const mapping = (data: MappingData) => {
			return pressedBtnOrAndParse(data.isButtonPressed, ...keys);	
		}
		this.#controlStates.set(controlStateName, mapping);
		return () => {return this.getControlValueBool(controlStateName)};
	}

	addTappedButton(controlStateName: string, ...keys: ButtonAndOr[]) {
		const mapping = (data: MappingData) => {
			return tappedBtnOrAndParse(data, ...keys);
		}
		this.#controlStates.set(controlStateName, mapping);
		return () => {return this.getControlValueBool(controlStateName)};
	}

	addReleasedButton(controlStateName: string, ...keys: ButtonAndOr[]) {
		const mapping = (data: MappingData) => {
			return releasedBtnOrAndParse(data, ...keys);
		}
		this.#controlStates.set(controlStateName, mapping);
		return () => {return this.getControlValueBool(controlStateName)};
	}

	/** Adds a one dimenensional "axis". Follows the and or logic for the buttons you provide.
	 *
	 * @example
	 * add1DAxis("Throttle", {pos: "KeyW", neg: "KeyS"})
	 * // this would be 1 when W is pressed, and -1 when S is pressed. 0 when both
	 */
	add1DAxis(controlStateName: string, keys: {pos: ButtonAndOr[], neg: ButtonAndOr[]}) {
		const mapping = (data: MappingData) => {
			const pos = pressedBtnOrAndParse(data.isButtonPressed, ...keys.pos);
			const neg = pressedBtnOrAndParse(data.isButtonPressed, ...keys.neg);
			return +pos - +neg;
		}
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
	addMovementController(controlStateName: string, keys: {left: ButtonAndOr[], right: ButtonAndOr[], up: ButtonAndOr[], down: ButtonAndOr[]}) {
		const mapping = (data: MappingData) => {
			const left = pressedBtnOrAndParse(data.isButtonPressed, ...keys.left);
			const right = pressedBtnOrAndParse(data.isButtonPressed, ...keys.right);
			const up = pressedBtnOrAndParse(data.isButtonPressed, ...keys.up);
			const down = pressedBtnOrAndParse(data.isButtonPressed, ...keys.down);
			return [+right - +left, +up - +down];
		}
		this.#controlStates.set(controlStateName, mapping);
		return () => this.getControlValue2dNumber(controlStateName);
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
		return () => this.getControlValue2dNumber(controlStateName);
	}

	addWheelHandler(controlStateName: string) {
		const mapping = (data: MappingData) => {
			return (data.wheel) ? data.wheel : 0;
		}
		this.#controlStates.set(controlStateName, mapping);
		return () => this.getControlValueNumber(controlStateName);
	}

	private get mappingData() {
		const mousePos = this.#getMousePosition();
		return {
			buttonsPressed: this.buttonsPressed,
			buttonsTapped: this.buttonsTapped,
			buttonsReleased: this.buttonsReleased,
			isButtonPressed: (key: ButtonCodeStr) => {
				const value = this.buttonPressedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isButtonTapped: (key: ButtonCodeStr) => {
				const value = this.buttonTappedStates.get(key);
				return (value === undefined) ? false : value;
			},
			isButtonReleased: (key: ButtonCodeStr) => {
				const value = this.buttonReleasedStates.get(key);
				return (value === undefined) ? false : value;
			},
			mouseX: mousePos.mouseX,
			mouseY: mousePos.mouseY,
			wheel: this.#wheel
		}
	}

	/**
	* Gets the current state of a control state. Control states are created with "addControlState"
	*/
	getControlValue(name: string): boolean | number | number[] {
		const mapping = this.#controlStates.get(name);

		if (!mapping) 
      throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist`);

		/*const mousePos = */this.#getMousePosition();

		return mapping(this.mappingData);
	}

	getControlValueBool(name: string): boolean {
		const value = this.getControlValue(name)
		if (typeof value === 'boolean') return value;
    throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist or is wrong type`);
	}

	getControlValueNumber(name: string): number {
		const value = this.getControlValue(name);
		if (typeof value === 'boolean') return +value;
		if (typeof value !== 'number') 
      throw new Error(`[PotentiKeyMap]: ${name} control state doesn't exist or is wrong type`);
		return value;
	}

	getControlValue2dNumber(name: string): number[] {
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
		})

		this.#buttonsReleased.clear();

		this.#buttonReleasedStates.forEach((_, key) => {
			this.#buttonReleasedStates.set(key, false);
		});
		this.#wheel = 0;
	}

	get #inputblockersActive () {
		for(const state of this.#inputBlockerStates) {
			if (state) return state;
		}	
		return false;
	}

	addInputBlockingElement(element: HTMLElement) {
		const index = this.#inputBlockingElements.length;
		this.#inputBlockingElements.push(element);	
		this.#inputBlockerStates.push(false);

		this.#inputBlockingElements[index].onmouseover = () => {

			this.#clearStates();
			this.#inputBlockerStates[index] = true;
		}

		this.#inputBlockingElements[index].onmouseout = () => {
			this.#clearStates();
			this.#inputBlockerStates[index] = false;
		}

	}
}
