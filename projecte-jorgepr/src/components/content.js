/* eslint-disable no-undef */
export { renderContent, inici }

//Necessitem tres poss= cap (fa l'acció), cua (per a eliminar-se), coll

//FUNCIÓ D'INICI
function inici(){
  const canvas = crearCanvas(30);

  afegirPoma(canvas);
  pintar(Math.floor(canvas.size/2),Math.floor(canvas.size/2),"serp");

  document.addEventListener('keydown', (event, canvas) => { 
    moviment(event, canvas);
  });
}

function crearCanvas(volum = 30){
//El map sols opera amb elements existents, així que si no l'omplim no entra

  return new Array(volum)
      .fill(null)
      .map((_, y) => new Array(volum)
      .fill(null)
      .map((_, x) => 
      ({
        x: x,
        y: y,
        estat: null,
        pos: 0
      })
      ));
}
//FUNCIONS DE MOVIEMNT DE LA SERP
function moviment(event, canvas){

    let cap = canvas.filter(c => c.pos == 1);
    
    switch(event.key){
    case "ArrowUp": {
    if(comprovarLimit(cap.y--, canvas)) {
      disminuir(canvas);
    } else {
      canvas.filter(c => c.pos > 0).map(c => c.pos++);
      canvas[cap.x][cap.y--].pos++;
      pintar(cap.x, cap.y--, "serp")
      canvas[cap.x][cap.y--].estat !== null?
      afegirPoma(canvas):
      disminuir(canvas);
    }
    }; break;
    case "ArrowRight": {
    if(comprovarLimit(cap.x++, canvas)) {
      disminuir(canvas);
    } else {
      canvas.filter(c => c.pos > 0).map(c => c.pos++);
      canvas[cap.x++][cap.y].pos++;
      pintar(cap.x++, cap.y, "serp")
      canvas[cap.x++][cap.y].estat !== null?
      afegirPoma(canvas):
      disminuir(canvas);
    }
    }; break;
    case "ArrowDown": {
    if(comprovarLimit(cap.y++, canvas)) {
      disminuir(canvas);
    } else {
      canvas.filter(c => c.pos > 0).map(c => c.pos++);
      canvas[cap.x][cap.y++].pos++;
      pintar(cap.x, cap.y++, "serp")
      canvas[cap.x][cap.y++].estat !== null?
      afegirPoma(canvas):
      disminuir(canvas);
    }
    }; break;
    case "ArrowLeft": {
    if(comprovarLimit(cap.x--, canvas)) {
      disminuir(canvas);
    } else {
      canvas.filter(c => c.pos > 0).map(c => c.pos++);
      canvas[cap.x--][cap.y].pos++;
      pintar(cap.x--, cap.y, "serp")
      canvas[cap.x--][cap.y].estat !== null?
      afegirPoma(canvas):
      disminuir(canvas);
    }
    }; break;
    }
}

function comprovarLimit(pos, canvas){
  if(pos >= canvas.size || pos <= 0)
    return true;
  else
    return false;
}

function disminuir(canvas){
  let cua = canvas.filter(c => c.pos > 0).max;
  cua.pos = 0;
  borrar(cua.x,cua.y, "serp")
}

//FUNCIÓ DE AFEGIR ELEMENTS(SOLS 1 DE TIPUS)
function afegirPoma(canvas){
  let x = Math.floor(Math.random()*canvas.length);
  let y = Math.floor(Math.random()*canvas.length);

  let poma = canvas.filter(c => c.estat === "poma");
  
  if(canvas[x][y].estat === null){
    console.log('poma')

    console.log(poma.x)
        console.log('x:'+x)

    canvas[x][y].estat = 'poma';
    pintar(x,y,'poma');
    borrar(poma.x,poma.y, "poma")
    poma.estat = null;
  }
  else if(canvas.filter(null).size == 0) {
    finalitzarJoc();
  } else{
    afegirPoma(canvas);  
  }
}

//FUNCIÓ DE CREIXEMENT DE LA SERP
// function creixer(canvas, pos){
//      canvas.filter(e => e.pos > 0).max;
// }

//FUNCIÓ D'EFECTE DE MENJAR
// function menjar(canvas){
//   creixer(canvas);
// }

//FUNCIÓ SOLES DE RENDERITZAT DE CANVAS(ARRAY)
function renderContent(volum){
let canvas = crearCanvas(volum);

    return `
<div class="container board-wrapper">
  <div class="board">
  ${
    canvas.map((f, indexY)=>`<div class="columna">
      ${f.map((_, indexX) => `<div id="${""+ indexX + indexY}" class="celda"></div>`).join('') }
      </div>`).join('')
  }
  </div>
</div>
    `;
}
function pintar(x,y,forma){
  let id = "#"+x+y;
  console.log(id)

  let casella = document.querySelector(id);
  console.log(casella)
  casella.classList.add(forma);
}
function borrar(x,y,forma){
  let casella = document.querySelector("#"+x+y);
  
  console.log("A borrar "+"#"+x+y);
  console.log(casella);

  casella.classList.remove(forma);
}
//FUNCIÓ DE FINALITZAR JOC
function finalitzarJoc(){
  return null;
}

//Canvas