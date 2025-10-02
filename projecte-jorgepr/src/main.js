import "./style.scss";
//import javascriptLogo from "./javascript.svg";
//import viteLogo from "/vite.svg";
//import { setupCounter } from "./counter.js";

//import * as bootstrap from "bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from 'bootstrap';  // opcional, si usas el JS de Bootstrap

import { buildMenu } from "./components/header";
import { router } from "./router";

document.addEventListener("DOMContentLoaded", async () => {
    const appDiv = document.querySelector('#app');
  const menuDiv = document.querySelector("#menu");
  const containerDiv = document.querySelector("#container");
  containerDiv.innerHTML = "";
  menuDiv.append(buildMenu());

    router(window.location.hash, appDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, appDiv);
  });
});
