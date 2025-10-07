/* eslint-disable no-undef */

//FUNCIÓ D'INICI
export function inici(volum) {
  const canvas = crearCanvas(volum);

  //POSSICIÓ INICIAL DE LA SERP
  let posicioInicialX = Math.floor(canvas.length / 2);
  let posicioInicialY = Math.floor(canvas.length / 2);

  canvas[posicioInicialX][posicioInicialY].pos = 1;
  pintar(posicioInicialX, posicioInicialY, "serp");
  //MOVIMENT DE LA SERP
  document.addEventListener("keydown", (event) => {
    moviment(event, canvas);
  });

  afegirPoma(canvas);

  //EN UN LISTENER ELS PARÀMETRES QUE PODEM AGAFAR ENS ELS PASSA EL NAVEGADOR, PEL QUE SOLES POT PASSAR EVENT, NO CANVAS, JA QUE EL NAVEGADOR NO EL TÉ NI ÉS PART DELS SEUS RECURSOS

}

function crearCanvas(volum = 20) {
  //El map sols opera amb elements existents, així que si no l'omplim no entra

  return new Array(volum).fill(null).map((_, y) =>
    new Array(volum).fill(null).map((_, x) => ({
      x: x,
      y: y,
      estat: null,
      pos: 0,
    }))
  );
}

//FUNCIONS DE MOVIEMNT DE LA SERP
function moviment(event, canvas) {
  
  let cap = canvas.filter((c) => c.pos === 1).get();

  if(!cap) return;

  switch (event.key) {
    case "ArrowUp":
      {
        if (comprovarLimit(cap.y--, canvas)) {
          disminuir(canvas);
        } else {
          canvas.filter((c) => c.pos > 0).map((c) => c.pos++);
          canvas[cap.x][cap.y--].pos++;
          pintar(cap.x, cap.y--, "serp");
          canvas[cap.x][cap.y--].estat !== null
            ? afegirPoma(canvas)
            : disminuir(canvas);
        }
      }
      break;
    case "ArrowRight":
      {
        if (comprovarLimit(cap.x++, canvas)) {
          disminuir(canvas);
        } else {
          canvas.filter((c) => c.pos > 0).map((c) => c.pos++);
          canvas[cap.x++][cap.y].pos++;
          pintar(cap.x++, cap.y, "serp");
          canvas[cap.x++][cap.y].estat !== null
            ? afegirPoma(canvas)
            : disminuir(canvas);
        }
      }
      break;
    case "ArrowDown":
      {
        if (comprovarLimit(cap.y++, canvas)) {
          disminuir(canvas);
        } else {
          canvas.filter((c) => c.pos > 0).map((c) => c.pos++);
          canvas[cap.x][cap.y++].pos++;
          pintar(cap.x, cap.y++, "serp");
          canvas[cap.x][cap.y++].estat !== null
            ? afegirPoma(canvas)
            : disminuir(canvas);
        }
      }
      break;
    case "ArrowLeft":
      {
        if (comprovarLimit(cap.x--, canvas)) {
          disminuir(canvas);
        } else {
          canvas.filter((c) => c.pos > 0).map((c) => c.pos++);
          canvas[cap.x--][cap.y].pos++;
          pintar(cap.x--, cap.y, "serp");
          canvas[cap.x--][cap.y].estat !== null
            ? afegirPoma(canvas)
            : disminuir(canvas);
        }
      }
      break;
  }
}

function comprovarLimit(pos, canvas) {
  if (pos >= canvas.length) return true;
  if(pos < 0) return true;
  return false;
}

function disminuir(canvas) {
  let cua = canvas.filter((c) => c.pos > 0).max;
  cua.pos = 0;
  borrar(cua.x, cua.y, "serp");
}

//FUNCIÓ DE AFEGIR ELEMENTS(SOLS 1 DE TIPUS)
function afegirPoma(canvas) {
console.log("Afegint poma...")

  let x = Math.floor(Math.random() * canvas.length);
  let y = Math.floor(Math.random() * canvas.length);

  let poma = canvas.filter((c) => c.estat === "poma");

  if (canvas[x][y].estat === null) {

    canvas[x][y].estat = "poma";
    pintar(x, y, "poma");

    if(poma.estat === "poma"){
      console.log("Poma: "+typeof poma)
      borrar(poma.x, poma.y, "poma");
      poma.estat = null;
    } 
    
  } else if (canvas.filter(null).size == 0) {
    finalitzarJoc();
  } else {
    afegirPoma(canvas);
  }
}

//FUNCIÓ RECERCA AL GRID
function recercaGrid(canvas, atribut, criteri){
  for(let col of canvas )
    for(let element of col){
      if(element[atribut] === criteri){
        return element;
      }
    }
    return null;
  }


//FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
export function renderContent(volum = 30) {
console.log("Canvas volum: "+volum)

  let canvas = crearCanvas(volum);
console.log("Render canvas...")
  return `
<div class="container board-wrapper">
  <div class="board">
  ${canvas
    .map(
      (f, indexY) => `<div class="columna">
      ${f.map((_, indexX) => `<div id="${"" + indexX + indexY}" class="celda"></div>`).join("")}
      </div>`
    )
    .join("")}
  </div>
</div>
    `;
}

function pintar(x, y, forma) {
  let id = "" + x + y;
  console.log(id);

  let casella = document.getElementById(id);
    console.log("A pintar " + "#" + id+" forma: "+forma);
  casella.classList.add(forma);
  console.log(casella);


  casella.estat = forma;
}

function borrar(x, y, forma) {
  let id = "" + x + y;

  let casella = document.getElementById(id);

  console.log("A borrar " + "#" + id+" forma: "+forma);

  casella.classList.remove(forma);
  console.log(casella);

  casella.estat = null;
}

//FUNCIÓ DE FINALITZAR JOC
function finalitzarJoc() {
console.log("S'acabó")
}

//Canvas
