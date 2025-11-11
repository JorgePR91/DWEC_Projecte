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

const serp = [{
  x: posicioInicialX,
  y: posicioInicialY,
  estat: "serp",
  pos: 1
 }];
 console.log(serp);
 /*
 ¿Cómo solucionarlo?
Debes mantener el estado de serp y poma fuera de la función de evento, y actualizarlo tras cada movimiento.
El intervalo debe ejecutarse de forma continua, y solo cambiar la dirección con la tecla, no reiniciar el intervalo.
Tras cada movimiento, debes redibujar el canvas con el nuevo estado.
Resumen:
La serpiente no se mueve porque el estado no se actualiza correctamente y el renderizado no se produce tras cada movimiento. Además, el manejo del intervalo no es el adecuado para un juego de tipo Snake.
1. Poner en orden y combinar métodos existentes
Sí, es necesario. Tienes la mayoría de funciones necesarias, pero el flujo de datos y el renderizado no están bien conectados.
Debes mantener el estado de la serpiente (serp), la manzana (poma) y la dirección actual en variables que sean accesibles por el bucle principal del juego.
El bucle principal debe:
Calcular el nuevo estado (movimiento).
Actualizar las variables de estado.
Redibujar el canvas.
2. ¿Hace falta escribir algún método nuevo?
No es estrictamente necesario escribir métodos nuevos, pero sí debes:
Añadir una función de “bucle de juego” (game loop) que se ejecute cada X milisegundos y mueva la serpiente en la dirección actual.
Añadir una función para actualizar el DOM tras cada movimiento.
Añadir lógica para cambiar la dirección con las teclas, sin reiniciar el intervalo.
3. ¿Un custom event lo solucionaría?
No es imprescindible para un Snake sencillo, pero puede ser útil si quieres separar la lógica del juego de la visualización.
Un custom event sería útil si quieres que la lógica del juego emita un evento cada vez que cambia el estado, y la vista (canvas) escuche ese evento para redibujar.
Para tu caso, puedes solucionarlo simplemente organizando el flujo y el estado, sin necesidad de custom events.
Enfoque recomendado (resumido):
1. Variables globales (o de módulo) para serp, poma, direccion, interval.
2. Al pulsar una tecla, solo cambias la dirección.
3. El intervalo llama a una función que:

Calcula el nuevo estado con moviment.
Actualiza las variables.
Redibuja el canvas.
4. Solo reinicias el intervalo al iniciar o reiniciar el juego, no en cada tecla.
 */
  let canvas = document.querySelector('#gameCanvas');
  let poma = joc.afegirPoma({serp, volum});
  canvas.replaceChildren(updateCanvas({canvas, serp, poma}))
  let interval;

  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    // clearInterval(interval);
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
  let celdes = nouCanvas.querySelectorAll('.celda');

  celdes.forEach(element => element.className = "celda"
  );

  serp.forEach(element => {
    let id = "x" + element.x + "y" + element.y;
    nouCanvas.querySelector(`#${id}`).classList.add(element.estat);
  });

  let idPoma = "x" + poma.x + "y" + poma.y;
  nouCanvas.querySelector(`#${idPoma}`).classList.add(poma.estat);

  return nouCanvas;
}