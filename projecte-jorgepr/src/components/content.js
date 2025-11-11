export { inici }
import * as joc from "../game/logicaJoc.js";

// TODO Decidir si separem la part lògica de la visual: esdeveniment personalitzat per a que carregue: un document per al container i altre per al joc i en el moment que la matriu del joc canvie li enviem l'esdeveniment personalitzat al carregar el canvas.
// Saber què carregaria millor el navegador: canviar l'estil de les casselles o divs vs canviar la classe; canviar sols les casselles afectades o tot el tauler


// [ ] FUNCIÓ D'INICI
// entrada: volum de la matriu
// internament: agafa un element del dom per a modificar
// eixida: interval
const inici = (volum) => {

  //POSSICIÓ INICIAL DE LA SERP
  let posicioInicialX = Math.floor(volum / 2);
  let posicioInicialY = Math.floor(volum / 2);

let serp = {
  x: posicioInicialX,
  y: posicioInicialY,
  estat: "serp",
  pos: 1
 };
  let canvas = document.querySelector('#gameCanvas');
  let poma =joc.afegirPoma({serp, volum});
  updateCanvas({canvas, serp, poma})
  let interval;

  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    clearInterval(interval);
    interval = setInterval(() => joc.moviment({event, serp, poma, volum}), 200);
  });


  return interval;
}

//[x] Funció per a crear la matriu interna
// entrada: la grandària
// eixida: la matriu
function crearCanvas(volum = 10) {
  //El map sols opera amb elements existents, així que si no l'omplim no entra

  return new Array(volum).fill(null).map((_, x) =>
    new Array(volum).fill(null).map((_, y) => ({
      x: x,
      y: y,
      estat: null,
      pos: 0,
    }))
  );
}


// [ ] Funció per a renderitzar el contingut: botó amb canvas
// entrada: volum del canvas
// internament toca el document
// eixida: element de secció
export function renderContent(volum = 10) {

  const section = document.createElement("section");
  section.setAttribute('id', 'sectionGame')

    const div = document.createElement("div");
  div.setAttribute('id', 'gameContainer');
  div.classList.add('container');
  div.classList.add('board-wrapper');
    div.classList.add('mb-5');

  div.appendChild(renderCanvas(volum));

  section.appendChild(div);

    let button = document.createElement("button");
    button.textContent = "Inici";
    button.classList.add('btn');
    button.classList.add('btn-primary');
    section.append(button);

    button.addEventListener("click", () => {
      document.querySelector("#gameContainer").replaceChild(renderCanvas(volum), div.querySelector('#gameCanvas'));
      inici(volum);
    });

  return section;
}

//[ ] FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
// entrada: volum de la matriu
// internament: toca el document per a afegir coses i crear
// eixida: element amb el canvas o div
export function renderCanvas(volum = 30) {
  console.log("Render canvas...");

  let contingut = "";

  for (let i = 0; i < volum; i++) {
    contingut += `<div class="columna">`;
    for (let j = 0; j < volum; j++) {
      contingut += `<div id="x${i}y${j}" class="celda"></div>`;
    }
    contingut += `</div>`;
  }

  const div = document.createElement('div');
  div.setAttribute('id', 'gameCanvas');
  div.classList.add('glow-effect');
  div.classList.add('board');

  div.innerHTML = contingut;

  return div;
}

//[ ] Funció per a canviar l'estat d'una casella
// entrada: cooredenades de la casella i forma a canviar
// internament: agafa elements del document
// eixida: casella
function pintar(coord, forma) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = document.getElementById(id);

  console.log("A pintar " + "#" + id + " forma: " + forma);

  casella.classList.add(forma);
  console.log(casella);
}

//[ ] Funció per a canviar l'estat/esborrar d'una casella
// entrada: cooredenades de la casella i forma a canviar
// internament: agafa elements del document
// eixida: res
function borrar(coord, forma) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = document.getElementById(id);

  console.log("A borrar " + "#" + id + " forma: " + forma);

  casella.classList.remove(forma);

  console.log(casella);
}

const updateCanvas = ({canvas, serp, poma}) => {
  
  let nouCanvas = canvas.cloneNode(true);
  nouCanvas.forEach(element => element.className = "celda"
  );

  serp.forEach(element => {
    let id = "x" + element.x + "y" + element.y;
    nouCanvas.getElementById(id).classList.add(element);
  });

  let idPoma = "x" + poma.x + "y" + poma.y;
  nouCanvas.getElementById(idPoma).classList.add(poma.estat);

  return nouCanvas;
}