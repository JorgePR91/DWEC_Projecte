import { router } from "./router";

//import { inici } from "./components/content";
import { renderFooter } from "./components/footer";
//import { renderHeader } from "./components/header";
import "./components/layout/app-header/app-header-nav";
import "./components/UI/app-profile/app-profile";
import "./components/UI/app-login/app-login";
import "./components/UI/app-game/app-game";
import "./components/UI/app-eleccio-btn/app-eleccio-btn";
import "./components/UI/app-partides-list/app-partides-list";
import "./style.scss";

document.addEventListener("DOMContentLoaded", async () => {

  const footerDiv = document.querySelector("#footer");
  footerDiv.innerHTML = renderFooter();

  const containerDiv = document.querySelector("#container");
  const volum = 10;

  //AÇÒ POT DUPLICAR EL ROUTER PERQUÈ CRIDES A LA FUNCIÓ INNERHTML EN EL RUTER I SUBSTITUEIX TOT EL DIV
  //PER A QUE NO ES RENDERITZE TOT DOS VEGADES SOLES RENDERITZEM AMB EL ROUTER, RES DE INNERHTML RENDERCONTENT
  router(window.location.hash, containerDiv, volum);
  localStorage.clear();
  window.addEventListener("hashchange", () => {
    router(window.location.hash, containerDiv, volum);
  });
});
