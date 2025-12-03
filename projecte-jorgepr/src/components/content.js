import { bucle, iniciJoc } from "../game/logicaJoc";
import { interval, tap } from "rxjs";

// TODO Decidir si separem la part lògica de la visual: esdeveniment personalitzat per a que carregue: un document per al container i altre per al joc i en el moment que la matriu del joc canvie li enviem l'esdeveniment personalitzat al carregar el canvas.
// Saber què carregaria millor el navegador: canviar l'estil de les casselles o divs vs canviar la classe; canviar sols les casselles afectades o tot el tauler

// [ ] FUNCIÓ D'INICI
// entrada: volum de la matriu
// internament: agafa un element del dom per a modificar
// eixida: interval
const inici = (volum) => {
  const { $serp, $poma, $direccio, $estat, $punts, $joc } = iniciJoc(volum);

  let canvas = document.querySelector("#gameCanvas");
  let section = document.querySelector("#sectionGame");

  /* Suscripciones para la UI (mantén las referencias por separado)
  const subscripcioUISerp = $serp.subscribe((serp) => {
    [...document.querySelectorAll('.serp')].forEach(e => 
      borrar({ x: parseInt(e.id.match(/x(\d+)/)[1]), y: parseInt(e.id.match(/y(\d+)/)[1]) }, "serp")
    );
    serp.forEach((pos) => pintar({ x: pos.x, y: pos.y }, "serp"));
  });*/
  let serpAntiga = [];
  let pomaAntiga = null;
  //Control de les subscripcions complet
  const subsJoc = [];

  const subsSerp = $serp.subscribe((serp) => {
    actualitzarSerp({ antic: serpAntiga, nou: serp, contenidor: canvas });
    serpAntiga = structuredClone(serp);

    // if (serp.length === 0) {
    //   $estat.next("finalitzat");
    //   subsSerp.unsubscribe();
    // }
  });
  subsJoc.push(subsSerp);

  const subsPoma = $poma.subscribe((poma) => {
    if (pomaAntiga)
      borrar({
        coord: { x: pomaAntiga.x, y: pomaAntiga.y },
        forma: "poma",
        contenidor: canvas,
      });

    pintar({
      coord: { x: poma.x, y: poma.y },
      forma: "poma",
      contenidor: canvas,
    });
    pomaAntiga = structuredClone(poma);
  });
  subsJoc.push(subsPoma);

  $punts.subscribe((e) => e >0  && (section.querySelector("#puntuacio").value = e));
  
  //const joc = $joc.subscribe();
  const estat = $estat.subscribe(
    (est) => est === "finalitzat" && estat.unsubscribe()
  );

  const subsBucle = bucle({
    $serp,
    $poma,
    $direccio,
    $estat,
    $punts,
    volum,
  });
subsJoc.push(subsBucle);

  const subsEstat = $estat.subscribe(estat =>{
    if (estat === "guardat"){
      console.log('Partida guardada');
            subsBucle.unsubscribe();
    } else if(estat === "finalitzat") {
      console.log('Finalitzar partida');
            subsBucle.unsubscribe();
    }
  });
  subsJoc.push(subsEstat);
  //MOVIMENT DE LA SERP: en una constant per a poder eliminar l'esdeveniment 
  const eventTecles = (event) => {
    const estatAct = $estat.getValue();

    if (estatAct === "parat") $estat.next("jugant");

    switch (event.key) {
      case "ArrowUp":
        $direccio.next("dalt");
        break;
      case "ArrowRight":
        $direccio.next("dreta");
        break;
      case "ArrowDown":
        $direccio.next("baix");
        break;
      case "ArrowLeft":
        $direccio.next("esquerra");
        break;
      case " ":
        if (estatAct === "jugant")
        $estat.next("guardat");
      else if (estatAct === "guardat")
        $estat.next("jugant");
        break;
      default:
        return;
    }
  };

  document.addEventListener("keydown", eventTecles);



  return () => {
    document.removeEventListener("keydown", eventTecles);
    subsJoc.forEach(sub => sub.unsubscribe);
  };
};

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
  section.setAttribute("id", "sectionGame");

  const puntuacio = document.createElement("div");
  puntuacio.setAttribute("id", "divPuntuacio");
  puntuacio.classList.add("d-flex");
  puntuacio.classList.add("align-items-center");
  puntuacio.classList.add("justify-items-center");
  puntuacio.classList.add("mb-4");
  puntuacio.classList.add("fs-3");
  puntuacio.classList.add("glow-text");
  puntuacio.classList.add("mx-auto");


  const input = document.createElement("input");
  input.setAttribute("id", "puntuacio");
  input.setAttribute("name", "puntuacio");
  input.setAttribute('style', 'width: 3em !important;');
  input.classList.add('form-control');
  input.classList.add('d-inline-bloc');
  input.classList.add('input-no-interactivo');
  input.classList.add('bg-transparent');
  input.classList.add('border-0');
  input.classList.add('text-end');
  //input.classList.add('m-3');
  //input.classList.add('p-2');
  input.classList.add('text-white');
  input.classList.add("fs-3");
  //input.classList.add("glow-text");

  const label = document.createElement("label");
  label.setAttribute('for', 'puntuacio');
  label.classList.add('form-label');
  label.classList.add('m-0');
  label.textContent = 'Puntuació';

  puntuacio.classList.add("align-content-center");
  puntuacio.classList.add("justify-content-center");
  //label.classList.add("align-items-center");
  label.classList.add("justify-items-center");
  input.classList.add("align-items-center");
  input.classList.add("justify-items-center");

    puntuacio.append(label, input);

  const div = document.createElement("div");
  div.setAttribute("id", "gameContainer");
  div.classList.add("container");
  div.classList.add("board-wrapper");
  div.classList.add("rounded");
  div.classList.add("mb-5");

  div.appendChild(renderCanvas(volum));

  section.append(puntuacio, div);

  let button = document.createElement("button");
  button.textContent = "Inici";
  button.classList.add("btn");
  button.classList.add("btn-primary");
  button.classList.add('text-black');
  section.append(button);

  let bucle = null;

  button.addEventListener("click", () => {
    if(bucle) bucle();
  
    document
      .querySelector("#gameContainer")
      .replaceChild(renderCanvas(volum), div.querySelector("#gameCanvas"));
    bucle = inici(volum);
  });

  return section;
}

//[x] FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
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

  const div = document.createElement("div");
  div.setAttribute("id", "gameCanvas");
  div.classList.add("glow-effect");
  div.classList.add("board");

  div.innerHTML = contingut;

  return div;
}

//[x] Funció per a canviar l'estat d'una casella
// entrada: cooredenades de la casella i forma a canviar
// internament: agafa elements del document
// eixida: casella
function pintar({ coord, forma, contenidor }) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = contenidor.querySelector(`#${id}`);

  if (casella) {
    //console.log("A pintar " + "#" + id + " forma: " + forma);

    casella.classList.add(forma);
    //console.log(casella);
  }
  return contenidor;
}

//[x] Funció per a canviar l'estat/esborrar d'una casella
// entrada: cooredenades de la casella i forma a canviar
// internament: agafa elements del document
// eixida: res
function borrar({ coord, forma, contenidor }) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = contenidor.querySelector(`#${id}`);

  if (casella) {
    //console.log("A borrar " + "#" + id + " forma: " + forma);

    casella.classList.remove(forma);

    //console.log(casella);
  }
  return contenidor;
}

const actualitzarSerp = ({ antic, nou, contenidor }) => {
  if (!Array.isArray(nou) || nou.length === 0) return;

  if (!Array.isArray(antic) || antic.length === 0) {
    console.log("serp inicial");

    return nou.forEach((e) =>
      pintar({
        coord: { x: e.x, y: e.y },
        forma: "serp",
        contenidor: contenidor,
      })
    );
  }

  //Optimització IA: fer sets que són de recerca inmediata amb strings per sabes si estan o no
  const nouSet = new Set(nou.map((e) => `${e.x},${e.y}`));
  const anticSet = new Set(antic.map((e) => `${e.x},${e.y}`));

  antic.forEach(
    (e) =>
      !nouSet.has(`${e.x},${e.y}`) &&
      borrar({
        coord: { x: e.x, y: e.y },
        forma: "serp",
        contenidor: contenidor,
      })
  );
  nou.forEach(
    (e) =>
      !anticSet.has(`${e.x},${e.y}`) &&
      pintar({
        coord: { x: e.x, y: e.y },
        forma: "serp",
        contenidor: contenidor,
      })
  );

  return contenidor;
};

const updateCanvas = ({ canvas, serp, poma }) => {
  let nouCanvas = canvas.cloneNode(true);
  let celdes = nouCanvas.querySelectorAll(".celda");

  celdes.forEach((element) => (element.className = "celda"));

  serp.forEach((element) => {
    let id = "x" + element.x + "y" + element.y;
    nouCanvas.querySelector(`#${id}`).classList.add(element.estat);
  });

  let idPoma = "x" + poma.x + "y" + poma.y;
  nouCanvas.querySelector(`#${idPoma}`).classList.add(poma.estat);

  return nouCanvas;
};
