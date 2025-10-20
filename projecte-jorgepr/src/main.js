import { router } from "./router";
import "./style.scss";


//import { inici } from "./components/content";
import { renderHeader } from "./components/header";

document.addEventListener("DOMContentLoaded", async () => {
  // window.addEventListener("error", (e) => {
  //   console.error("❌ Error atrapado globalmente:", e.error || e.message);
  // });

  // window.addEventListener("unhandledrejection", (e) => {
  //   console.error("❌ Error en promesa no manejada:", e.reason);
  // });

  //const appDiv = document.querySelector('#app');
  const menuDiv = document.querySelector("#menu");
  menuDiv.innerHTML = renderHeader();

  const containerDiv = document.querySelector("#container");
  const volum = 10;

  //AÇÒ POT DUPLICAR EL ROUTER PERQUÈ CRIDES A LA FUNCIÓ INNERHTML EN EL RUTER I SUBSTITUEIX TOT EL DIV
  //PER A QUE NO ES RENDERITZE TOT DOS VEGADES SOLES RENDERITZEM AMB EL ROUTER, RES DE INNERHTML RENDERCONTENT
  router(window.location.hash, containerDiv, volum);

  window.addEventListener("hashchange", () => {
    router(window.location.hash, containerDiv, volum);
  });
});
