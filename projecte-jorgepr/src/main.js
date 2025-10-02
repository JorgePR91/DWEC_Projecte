import './style.scss'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

//import * as bootstrap from "bootstrap";
import { buildMenu } from "./components/header.js";

document.addEventListener("DOMContentLoaded", async () => {
  const menuDiv = document.querySelector("#menu");
  const containerDiv = document.querySelector("#container");
  containerDiv.innerHTML = "";
  menuDiv.append(buildMenu());
});


