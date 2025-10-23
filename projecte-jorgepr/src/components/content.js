//FUNCIÓ D'INICI
export function inici(volum) {
  let canvas = crearCanvas(volum);

  //POSSICIÓ INICIAL DE LA SERP
  let posicioInicialX = Math.floor(canvas.length / 2);
  let posicioInicialY = Math.floor(canvas.length / 2);

  canvas[posicioInicialX][posicioInicialY].pos = 1;
  canvas[posicioInicialX][posicioInicialY].estat = "serp";
  pintar({ x: posicioInicialX, y: posicioInicialY }, "serp");
  afegirPoma(canvas);
  let interval;

  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    clearInterval(interval);
    interval = setInterval(() => moviment(event, canvas), 200);
  });

  //EN UN LISTENER ELS PARÀMETRES QUE PODEM AGAFAR ENS ELS PASSA EL NAVEGADOR, PEL QUE SOLES POT PASSAR EVENT, NO CANVAS, JA QUE EL NAVEGADOR NO EL TÉ NI ÉS PART DELS SEUS RECURSOS
}

function crearCanvas(volum = 20) {
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

//FUNCIONS DE MOVIEMNT DE LA SERP
function moviment(event, canvas) {
  let cap;

  for (let fila of canvas)
    for (let element of fila) if (element.pos === 1) cap = element;
  //console.log(`Cap: `);
  //console.log(cap);

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
    comprovarLimit(coordNoves, canvas) ||
    canvas[coordNoves.x][coordNoves.y].estat === "serp"
  ) {
    disminuir(canvas);
    //   for (let fila of canvas)
    // for (let element of fila) if (element.pos > 1) element.pos--;
  } else {
    for (let fila of canvas)
      for (let element of fila) if (element.pos > 0) element.pos++;
    canvas[coordNoves.x][coordNoves.y].pos++;
    pintar(coordNoves, "serp");

    if (canvas[coordNoves.x][coordNoves.y].estat === "poma") {
      afegirPoma(canvas);
      canvas[coordNoves.x][coordNoves.y].estat = "serp";
      canvas[coordNoves.x][coordNoves.y].estat === "serp";
    } else {
      canvas[coordNoves.x][coordNoves.y].estat = "serp";
      disminuir(canvas);
    }
  }
}

function comprovarLimit(pos, canvas) {
  if (pos.x >= canvas.length || pos.y >= canvas.length) return true;
  if (pos.x < 0 || pos.y < 0) return true;
  return false;
}

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

//FUNCIÓ DE AFEGIR ELEMENTS(SOLS 1 DE TIPUS)
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

export function renderContent(volum = 10) {

  const codi = `<div id="gameContainer" class="container board-wrapper">
    ${renderCanvas(volum)}
  </div>`;

  const section = document.createElement("section");
  section.setAttribute('id', 'sectionGame')
  section.innerHTML = codi;

    let button = document.createElement("button");
    button.textContent = "Inici";
    section.append(button);

    button.addEventListener("click", () => {
      document.querySelector("#gameContainer").innerHTML = renderCanvas(volum);
      inici(volum);
    });

  return section;
}

//FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
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

  return `
  <div class="board">
    ${contingut}
  </div>
  `;
}

function pintar(coord, forma) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = document.getElementById(id);

  console.log("A pintar " + "#" + id + " forma: " + forma);

  casella.classList.add(forma);
  console.log(casella);
}

function borrar(coord, forma) {
  let id = "x" + coord.x + "y" + coord.y;
  let casella = document.getElementById(id);

  console.log("A borrar " + "#" + id + " forma: " + forma);

  casella.classList.remove(forma);

  console.log(casella);
}

//FUNCIÓ DE FINALITZAR JOC
function finalitzarJoc(st) {
  clearInterval(st);
  console.log("S'acabó");
}

//MÈTODE COMPROVACIÓ SERP
/*for (let fila of canvas) {
      for (let element of fila) {
        if (element.estat === "serp") {
          console.log(element);
        }
      }
    }*/
