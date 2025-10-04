# PotentiKeyMap

A Typescript input handler for games or whatever you want

### Initialization

To use **PotentiKeymap**, create a new control handler:

```Typescript
import {ControlHandler} from "../insert/whereEver/entrypoint/is"

const controlHandler = new ControlHandler(canvas/* Whatever element you want to effect the mouse*/)
```

In your update function, invoke the tick function at the end to ensure certain variables are updated:

```
function someGameUpdateFunction(deltaTime: number) {
    // bunch of update logic
    controlHandler.tick();
}
```

### Control states

Instead of thinking of **input** based off of whether a certain key is pressed,
potentiKeymap uses **control states**. Control states, in the context of potentiKeymap, are
abstractions we use to create more advanced controls. For instance, what if we wanted to
have a control that is only true when two buttons are pressed simultaneously? Control states
handle that for us!

To access a control state, you give it a unique name. This is used to grab the
value whenever you need it.

### Pressed button

We can add a simple pressed button like this:

```Typescript
const isJumping = controlHandler.addPressedButton("jump", "Space");
```

When we add a pressed button, it returns a function that returns a boolean based off of wether it is pressed or not:

```
if (isJumping()) {
    player.y += Infinity;
}
```

### Tapped/Released Buttons

We can also figure out if a button is just tapped or just released. This is effectively the builtin keydown or keyup from the event listener:

```Typescript
const tappedJump = controlHandler.addTappedButton("tappedJump", "Space");
const releasedJump = controlHandler.addReleasedButton("releasedJump", "Space");
```

The returned functions work the same as before...

### Alternative Keybinds

Lets say we wanted to have another button mapped to jump. We would simply list it off after "Space":

```Typescript
const isJumping = controlHandler.addPressedButton("jump", "Space", "ArrowUp");
```
We can endlessly do this...

```Typescript
const isJumping = controlHandler.addPressedButton("jump", "Space", "ArrowUp", "KeyW", ...);
```

### Key Combos

What if we wanted to have a super jump that only activates when two buttons are
pressed? We would group the keys into an array like so:

```Typescript
const isSuperJumping = controlHandler.addPressedButton("superJump", ["Space", "ShiftLeft"]);
```
*Note that this does work with tapped and released as well. This is why it is better than using an event listener!*

### 1 Dimensional Axis

Lets say we want to have a single value for strafing. We can do that too:

```Typescript
const strafe = controlHandler.add1DAxis(
    'strafe', 
    {
        pos: ['KeyD', 'ArrowRight'], // positive buttons
        neg: ['KeyA', 'ArrowLeft'] // negative buttons
    });
```

This returns -1 if we are strafing left, and postive 1 if we are strafing right, else it is 0.

Note how **pos** and **neg** are arrays. This is not to be confused with keyboard combos, in fact, you can still use them here if you nest them:

```Typescript
const sprintStrafe = controlHandler.add1DAxis(
    'strafe', 
    {
        pos: [['ShiftLeft', 'KeyD'], ['ShiftLeft', 'ArrowRight']], 
        neg: [['ShiftLeft', 'KeyA'], ['ShiftLeft', 'ArrowLeft']] 
    });
```

### Movement Controller (2D Axis)

This is effectively the same concept as before, but it returns an array, the first being x and the second being y.

```Typescript
const movement = controlHandler.addMovementController(
    'movement', 
    {
        left: ['KeyA'],
        right: ['KeyD'],
        down: ['KeyS'],
        up: ['KeyW'],
    });
```
Remember, up is positive, down is negative. Right is positive, and left is negative. We don't work in canvas space!

### Mouse Handler

We can get mouse position as well!
```Typescript
const mousePosition = controlHandler.addMouseHandler('mouse');
```
This returns an array with two numbers, representing the mouse position. If you
provide an element to the control handler, it will be relative to that. If it
is outside the bounds, it will be NaN.

*If you are wondering why we don't get mouse buttons, that is already implemented in the previous functions!*

### Wheel Handler

We can also create a mouse wheel handler. This gives us the mouse wheel scroll, either -1, 0, or 1.

```Typescript
const scroll = controlHandler.addWheelHandler('scroll');
```

### Custom Handler

What if you want to do something more complicated? Then you can manually add a control state!

```Typescript
const strafe = controlHandler.addControlState("strafe", (data) => {
    const left = data.isButtonPressed("KeyA");
    const right = data.isButtonPressed("KeyD");
    return +right - +left;
});
```

What is accessible in the data variable?

```Typescript
interface MappingData {
    /*The raw "Set()"s with the values being button codes.*/
    buttonsPressed;
    buttonsTapped;
    buttonsReleased;

    /*Helper functions*/
    isButtonPressed;
    isButtonTapped;
    isButtonReleased;

    /*Self explanatory*/
    mouseX;
    mouseY;
    wheel;
}
```

### Getting control states without having the function

There are different functions we can use that return different values:

```Typescript
// Returns a boolean, number, or number[]. Its on you to deal with that
controlHandler.getControlValue('jump');

// If you are confident the value is a boolean, 
// call this function, it throws if wrong type or doesn't exist
controlHandler.getControlValueBool('jump');

// Same idea with these ones
controlHandler.getControlValueNumber('jump');
controlHandler.getControlValue2dNumber('jump');


```

### Input blocking elements

What if you have an element like a modal pop up! You wouldn't want your mouse
to take input anymore! You can add an element that blocks input with this
function:

```Typescript
controlHandler.addInputBlockingElement(popup);
```
