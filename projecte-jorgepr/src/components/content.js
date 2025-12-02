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
  let pomaAntiga = [];

  const serp = $serp.subscribe(serp =>{
    actualitzarSerp({antic: serpAntiga, nou: serp, contenidor: canvas});
    serpAntiga = structuredClone(serp);
    if(serp.length === 0) {
      $estat.next("finalitzat");
      $serp.unsubscribe();
    }
  });

  const poma = $poma.subscribe((poma) =>{
    if(pomaAntiga.length !== 0)
borrar({coord: {x:poma.x, y: poma.y}, forma: "poma", contenidor: canvas});
   else
    pintar({coord: {x:poma.x, y: poma.y}, forma: "poma", contenidor: canvas});
  });

  $punts.subscribe(
    e => section.querySelector("#puntuacio").value = e
  );
  const joc = $joc.subscribe();
  const estat = $estat.subscribe(est => est === "finalitzat" && $estat.unsubscribe()
);

  
  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    if(estat !== "jugant") $estat.next("jugant");
    // clearInterval(interval);
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
        $estat.next("guardat");
        break;
      default:
        return;
    }
});

  const interval = bucle(
    {
      $serp,
      $poma,
      $direccio,
      $estat,
      $punts,
      volum
    }
  );

  return () => {
    joc.unsubscribe();
    serp.unsubscribe();
    poma.unsubscribe();
    $punts.unsubscribe();
  };};

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
  const input = document.createElement("input");
  input.setAttribute("id", "puntuacio");
  input.setAttribute("name", "puntuacio");
  const label = document.createElement("label");
  puntuacio.append(label, input);

  const div = document.createElement("div");
  div.setAttribute("id", "gameContainer");
  div.classList.add("container");
  div.classList.add("board-wrapper");
  div.classList.add("mb-5");

  div.appendChild(renderCanvas(volum));

  section.append(puntuacio, div);

  let button = document.createElement("button");
  button.textContent = "Inici";
  button.classList.add("btn");
  button.classList.add("btn-primary");
  section.append(button);

  let bucle;

  button.addEventListener("click", () => {
    bucle&& bucle.unsubscribe();
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
function pintar({coord, forma, contenidor}) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = contenidor.querySelector(`#${id}`);

    if(casella){

  console.log("A pintar " + "#" + id + " forma: " + forma);

  casella.classList.add(forma);
  console.log(casella);
}
return contenidor;

}

//[x] Funció per a canviar l'estat/esborrar d'una casella
// entrada: cooredenades de la casella i forma a canviar
// internament: agafa elements del document
// eixida: res
function borrar({coord, forma, contenidor}) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = contenidor.querySelector(`#${id}`);

  if(casella){
  console.log("A borrar " + "#" + id + " forma: " + forma);

  casella.classList.remove(forma);

  console.log(casella);
  }
return contenidor;
}

const actualitzarSerp = ({antic, nou, contenidor}) =>{
  
    if(!Array.isArray(nou) || nou.length === 0)
      return;
  console.log("entrar a pintar");

    if(!Array.isArray(antic) || antic.length === 0){
      console.log("serp inicial");

      return nou.forEach(e => pintar({coord: {x: e.x, y: e.y}, forma: "serp", contenidor: contenidor}));
    }


    //Optimització IA: fer sets que són de recerca inmediata amb strings per sabes si estan o no
    const nouSet = new Set(nou.map(e => `${e.x},${e.y}`));
    const anticSet = new Set(antic.map(e => `${e.x},${e.y}`));

    antic.forEach(e =>
      !nouSet.has(`${e.x},${e.y}`) && borrar({coord: {x: e.x, y: e.y}, forma: "serp", contenidor: contenidor})
    );
    nou.forEach(e =>
      !anticSet.has(`${e.x},${e.y}`) && pintar({coord: {x: e.x, y: e.y}, forma: "serp", contenidor: contenidor})
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
