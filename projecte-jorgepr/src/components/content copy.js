/* eslint-disable no-undef */

//FUNCIÓ D'INICI
export function inici(volum) {
  const canvas = crearCanvas(volum);

  //POSSICIÓ INICIAL DE LA SERP
  let posicioInicialX = Math.floor(canvas.length / 2);
  let posicioInicialY = Math.floor(canvas.length / 2);

  canvas[posicioInicialX][posicioInicialY].pos = 1;
  pintar({ x: posicioInicialX, y: posicioInicialY }, "serp");

  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    moviment(event, canvas);
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
  console.log("Moviment");

  let cap;

  for (let fila of canvas)
    for (let element of fila) if (element.pos === 1) cap = element;

console.log(`Cap: `)
console.log(cap)

  if (!cap) return;

  switch (event.key) {
    case "ArrowUp":
      {
        let coordNoves = { x: cap.x, y: cap.y - 1 };
        if (comprovarLimit(coordNoves, canvas)) {
          disminuir(canvas);
        } else {

          for (let fila of canvas)
            for (let element of fila) if (element.pos > 0) element.pos+=1;

          canvas[coordNoves.x][coordNoves.y].pos+=1;
          pintar(coordNoves, "serp");
          borrar(cap, "serp");
        }
        break;
      };

    case "ArrowRight":
      {
        let coordNoves = { x: cap.x + 1, y: cap.y };

        if (comprovarLimit(coordNoves, canvas)) {
          disminuir(canvas);
        } else {
          for (let fila of canvas)
            for (let element of fila) if (element.pos > 0) element.pos++;
          canvas[coordNoves.x][coordNoves.y].pos++;
          pintar(coordNoves, "serp");

        }
              break;
      };
    case "ArrowDown":
      {
        let coordNoves = { x: cap.x, y: cap.y + 1 };

        if (comprovarLimit(coordNoves, canvas)) {
          disminuir(canvas);
        } else {
          for (let fila of canvas)
            for (let element of fila) if (element.pos > 0) element.pos++;
          canvas[coordNoves.x][coordNoves.y].pos++;
          pintar(coordNoves, "serp");

        }
              break;
      };
    case "ArrowLeft":
      {
        let coordNoves = { x: cap.x - 1, y: cap.y };

        if (comprovarLimit(coordNoves, canvas)) {
          disminuir(canvas);
        } else {
          for (let fila of canvas)
            for (let element of fila) if (element.pos > 0) element.pos++;
          canvas[coordNoves.x][coordNoves.y].pos++;
          pintar(coordNoves, "serp");
        }
              break;
      };

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
  cua.pos = 0;
  console.log('Cua:')
  console.log(cua)

  borrar(cua, "serp");
}

export function renderContent(volum) {

  const codi = `<div id="gameContainer" class="container board-wrapper">
    ${renderCanvas(volum)}
  </div>`;

  function muntatge(contenidor) {
    let button = document.createElement("button");
    button.textContent = "Inici";
    document.getElementById("container").append(button);

    //SI PASSEM LA FUNCIÓ AMB PARÈNTESI S'EXECUTA, EN COMPTE DE QUEDAR-SE COM A CALLBACK
    button.addEventListener("click", () => {
      document.querySelector("#gameContainer").innerHTML = renderCanvas(volum);
      inici(volum);
    });
  }

  return { codi, muntatge };
}

//FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
export function renderCanvas(volum = 30) {
  console.log("Render canvas...");

  let contingut = "";

  for (let i = 0; i < volum; i++) {
    contingut += `<div class="columna">`;
    for (let j = 0; j < volum; j++) {
      contingut += `<div id="${i}${j}" class="celda"></div>`;
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
  let id = "" + coord.x + coord.y;

  let casella = document.getElementById(id);
  console.log("A pintar " + "#" + id + " forma: " + forma);

  casella.classList.add(forma);
  console.log(casella);

  casella.estat = forma;
}

function borrar(coord, forma) {
  let id = "" + coord.x + coord.y;

  let casella = document.getElementById(id);

  console.log("A borrar " + "#" + id + " forma: " + forma);

  casella.classList.remove(forma);
  console.log(casella);

  casella.estat = null;
}

//FUNCIÓ DE FINALITZAR JOC
function finalitzarJoc() {
  console.log("S'acabó");
}
