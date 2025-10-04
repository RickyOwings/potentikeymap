import {ControlHandler} from "../modules/potentikeymap/index.js"

const strafeStateDiv = document.body.appendChild(document.createElement("div"));
const inputSetDiv = document.body.appendChild(document.createElement("div"));
const mousePostionDiv = document.body.appendChild(document.createElement("div"));
const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.width = 800;
canvas.height = 800;
canvas.style.setProperty("border", "solid black 1px")

const controlHandler = new ControlHandler(canvas);

controlHandler.addControlState("strafe", (data) => {
	{ // input set div
		let str = "";
		data.buttonsPressed.forEach((button) => {
			str += button + " ";
		});

		inputSetDiv.innerHTML = str;
	}

	{ // input mouse position div
		mousePostionDiv.innerHTML = `Mouse X:${data.mouseX}, Mouse Y:${data.mouseY}`
	}
	const left = data.isButtonPressed("KeyA");
	const right = data.isButtonPressed("KeyD");
	return +right - +left;
});

setInterval(()=>{
	strafeStateDiv.innerHTML = `Strafe state: ${controlHandler.getControlValue("strafe")}`
}, 11);
