import {ControlHandler} from "../modules/potentikeymap/index.js"

const controlHandler = new ControlHandler();
const jumping = controlHandler.addPressedButton("jump", "Space", "KeyW");

const div = document.body.appendChild(document.createElement("div"));

setInterval(()=>{
  if(jumping()) {
    div.innerHTML = "JUMPING"
  } else {
    div.innerHTML = "NOT JUMPING"
  }
}, 10)
