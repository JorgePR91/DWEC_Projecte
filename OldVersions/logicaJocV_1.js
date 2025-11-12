export { carregarEscenari, moviment }
// TODO Decidir si separem la part lògica de la visual: esdeveniment personalitzat per a que carregue: un document per al container i altre per al joc i en el moment que la matriu del joc canvie li enviem l'esdeveniment personalitzat al carregar el canvas.
// Saber què carregaria millor el navegador: canviar l'estil de les casselles o divs vs canviar la classe; canviar sols les casselles afectades o tot el tauler


// [ ] FUNCIÓ De loop
// entrada: volum de la matriu
// internament: agafa un element del dom per a modificar
// eixida: interval
const carregarEscenari = (volum) => {
  let matriu = crearCanvas(volum);

  //POSSICIÓ INICIAL DE LA SERP
  let posicioInicialX = Math.floor(matriu.length / 2);
  let posicioInicialY = Math.floor(matriu.length / 2);

  matriu[posicioInicialX][posicioInicialY].pos = 1;
  matriu[posicioInicialX][posicioInicialY].estat = "serp";

  pintar({ x: posicioInicialX, y: posicioInicialY }, "serp");
  afegirPoma(matriu);
  let interval;

  return interval;

  //EN UN LISTENER ELS PARÀMETRES QUE PODEM AGAFAR ENS ELS PASSA EL NAVEGADOR, PEL QUE SOLES POT PASSAR EVENT, NO CANVAS, JA QUE EL NAVEGADOR NO EL TÉ NI ÉS PART DELS SEUS RECURSOS
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

//[ ] FUNCIONS DE MOVIEMNT DE LA SERP
// entrada: l'esdeveniment i el canvas html
// internament: sols toca el canvas intern
// eixida: res
// NOTE pot retornar una còpia així no modifica el paràmetre rebut
function moviment(event, matriu) {
  let cap;

  for (let fila of matriu)
    for (let element of fila) if (element.pos === 1) cap = element;

  if (!cap) return;

  let coordNoves;

  switch (event.key) {
    case "ArrowUp":
      coordNoves = { x: cap.x, y: cap.y - 1 };
      break;
    case "ArrowRight":
      coordNoves = { x: cap.x + 1, y: cap.y };
      break;
    case "ArrowDown":
      coordNoves = { x: cap.x, y: cap.y + 1 };
      break;
    case "ArrowLeft":
      coordNoves = { x: cap.x - 1, y: cap.y };
      break;
    default:
      return;
  }

  if (
    comprovarLimit(coordNoves, matriu) ||
    matriu[coordNoves.x][coordNoves.y].estat === "serp"
  ) {
    disminuir(matriu);
    //   for (let fila of canvas)
    // for (let element of fila) if (element.pos > 1) element.pos--;
  } else {
    for (let fila of matriu)
      for (let element of fila) if (element.pos > 0) element.pos++;
    matriu[coordNoves.x][coordNoves.y].pos++;
    pintar(coordNoves, "serp");

    if (matriu[coordNoves.x][coordNoves.y].estat === "poma") {
      afegirPoma(matriu);
      matriu[coordNoves.x][coordNoves.y].estat = "serp";
      matriu[coordNoves.x][coordNoves.y].estat === "serp";
    } else {
      matriu[coordNoves.x][coordNoves.y].estat = "serp";
      disminuir(matriu);
    }
  }
}

// [ ] funció per a saber si estem en el límit
// entrada: possició i canvas intern
// eixida: booleà
// NOTE fer-ho dins del mètode de moviment amb una ternària?
function comprovarLimit(pos, canvas) {
  if (pos.x >= canvas.length || pos.y >= canvas.length) return true;
  if (pos.x < 0 || pos.y < 0) return true;
  return false;
}

//[ ] Funció per a disminuir la serp
// entrada: canvas html?
// eixida: res
// NOTE com a eixida una còpia del canvas? un array amb la nova serp -implicaria que cada vegada que disminuira es tinguera que col·locar novament en el canvas, tenint que fer un nou mètode.
function disminuir(canvas) {
  let cua = canvas
    .flat()
    .reduce((accumulador, actual) =>
      actual.pos >= accumulador.pos ? actual : accumulador
    );

  //console.log("Cua:");
  //console.log(cua);

  cua.pos = 0;
  cua.estat = null;
  borrar(cua, "serp");
}

//[ ] Funció d'afegir poma
// entrada: tot el canvas
// eixida: res
function afegirPoma(canvas) {
  console.log("Afegint poma...");

  //  let x = Math.floor(Math.random() * canvas.length);
  //  let y = Math.floor(Math.random() * canvas.length);

  let arrCasLliures = canvas.flat().filter((c) => c.estat === null);

  if (arrCasLliures.length === 0) finalitzarJoc();

  let novaPoma =
    arrCasLliures[Math.floor(Math.random() * arrCasLliures.length)];

  let poma;

  for (let fila of canvas)
    for (let element of fila) if (element.estat === "poma") poma = element;
  console.log("poma");

  console.log(poma);

  if (poma) {
    poma.estat = null;
    borrar(poma, "poma");
  }

  // if (canvas[x][y].estat === null) {
  //   canvas[x][y].estat = "poma";
  //   pintar({ x: x, y: y }, "poma");
  // } else if (canvas.flat().filter((e) => e.estat === null).length == 0) {
  //   finalitzarJoc();
  // } else {
  //   afegirPoma(canvas);
  // }

  canvas[novaPoma.x][novaPoma.y].estat = "poma";
  pintar(canvas[novaPoma.x][novaPoma.y], "poma");
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

//[x] Funció per a canviar l'estat/esborrar d'una casella
// entrada: cooredenades de la casella i forma a canviar
// eixida: copia de l'objecte
const resetCasella = (object) => {
  let nouObject = structuredClone(object);
  nouObject.estat = null;
  nouObject.pos = 0;
  return nouObject;
}

//[ ] Funció per a finalitzar el joc
// entrada: l'interval
// eixida: res
// ¿ ? falta definir-la millor
function finalitzarJoc(st) {
  clearInterval(st);
  console.log("S'acabó");
}

//[ ] Mètode per a enviar el resultat
// entrada:
//eixida: una string: objectes a eliminar-objectes a canviar

//MÈTODE COMPROVACIÓ SERP
/*for (let fila of canvas) {
      for (let element of fila) {
        if (element.estat === "serp") {
          console.log(element);
        }
      }
    }*/
