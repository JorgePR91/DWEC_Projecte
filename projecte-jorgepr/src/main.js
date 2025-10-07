import "./style.scss";
import { router } from "./router";

import * as bootstrap from 'bootstrap';  // opcional, si usas el JS de Bootstrap

import { renderHeader } from "./components/header";
import { inici } from "./components/content";


document.addEventListener("DOMContentLoaded", async () => {
  
window.addEventListener('error', e => {
  console.error('❌ Error atrapado globalmente:', e.error || e.message);
});

window.addEventListener('unhandledrejection', e => {
  console.error('❌ Error en promesa no manejada:', e.reason);
});

  //const appDiv = document.querySelector('#app');
  const menuDiv = document.querySelector('#menu');
  const containerDiv = document.querySelector("#container");

   menuDiv.innerHTML = renderHeader();

     const volum = 20;

  //AÇÒ POT DUPLICAR EL ROUTER PERQUÈ CRIDES A LA FUNCIÓ INNERHTML EN EL RUTER I SUBSTITUEIX TOT EL DIV
  //PER A QUE NO ES RENDERITZE TOT DOS VEGADES SOLES RENDERITZEM AMB EL ROUTER, RES DE INNERHTML RENDERCONTENT
  router(window.location.hash+'#game', containerDiv, volum);

  let button = document.createElement('button');
  button.textContent = "Inici";
  containerDiv.appendChild(button);

//SI PASSEM LA FUNCIÓ AMB PARÈNTESI S'EXECUTA, EN COMPTE DE QUEDAR-SE COM A CALLBACK
  button.addEventListener('click',() => inici(volum));

    window.addEventListener("hashchange", () => {
    router(window.location.hash, containerDiv, volum);
  });
});
