import "./style.scss";
import { router } from "./router";

import * as bootstrap from 'bootstrap';  // opcional, si usas el JS de Bootstrap

import { renderHeader } from "./components/header";
import { renderContent, inici } from "./components/content";


document.addEventListener("DOMContentLoaded", async () => {
  
  //const appDiv = document.querySelector('#app');
  const menuDiv = document.querySelector('#menu');
  const containerDiv = document.querySelector("#container");

   menuDiv.innerHTML = renderHeader();
   containerDiv.innerHTML = renderContent();

  let button = document.createElement('button');
  button.textContent = "Inici";
  containerDiv.appendChild(button);

  button.addEventListener('click', inici());

  router(window.location.hash, containerDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, containerDiv);
  });
});
