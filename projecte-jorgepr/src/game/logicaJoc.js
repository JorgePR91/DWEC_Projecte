export { moviment };
// TODO Decidir si separem la part lògica de la visual: esdeveniment personalitzat per a que carregue: un document per al container i altre per al joc i en el moment que la matriu del joc canvie li enviem l'esdeveniment personalitzat al carregar el canvas.
// Saber què carregaria millor el navegador: canviar l'estil de les casselles o divs vs canviar la classe; canviar sols les casselles afectades o tot el tauler

//SERP ÉS UN ARRAY D'OBJECTES
//POMA ÉS UN OBJECTE
//[ ] Bucle del juego
// Calcular el nuevo estado (movimiento).
// Actualizar las variables de estado.
// Redibujar el canvas.
const bucle = (evt) => {
// Calcular el nuevo estado (movimiento).
moviment(evt);
// Actualizar las variables de estado.
let serp;
let poma;
// Redibujar el canvas.

}


//[x] Funció per a crear la matriu interna
// entrada: la grandària
// eixida: la matriu
const crearCanvas = (volum = 10) => {
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
const moviment = ({ event, serp, poma, volum }) => {
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

  let cap = serp.filter((element) => element.pos === 1)[0];

  if (!cap) finalitzarJoc();

  if (
    comprovarLimit({obj: coordNoves, volum }) ||
    comprovarSerp({ coord: coordNoves, obj: serp })
  ) {
    let novaSerp = disminuir(serp);
    return { novaSerp, poma };
  }

  if (comprovarSerp({coord: coordNoves, obj: [poma] })) {
    let novaSerp = creixerSerp({ coordNoves, serp });
    let novaPoma = afegirPoma(novaSerp);

    return { novaSerp, novaPoma };
  }

  let novaSerp = creixerSerp({ coordenades: coordNoves, serp });

  return { novaSerp, poma };
}

//[x] funció per a créixer la serp
// entrada: objecte 1 (serp) i coordenades a augmentar
// eixida: cópia de serp
const creixerSerp = (serp) =>{
    let serpAugmentada = structuredClone(serp);
return (coordenades) => {
  serpAugmentada.forEach((part) => part.pos++);
  serpAugmentada.unshift({
    x: coordenades.x,
    y: coordenades.y,
    estat: "serp",
    pos: 1,
  });
  return serpAugmentada;
} 
};

//[x] funció per a saber si estem en el límit
// entrada: objecte 1 (cap de la serp) i canvas intern
// eixida: booleà
// NOTE fer-ho dins del mètode de moviment amb una ternària?
const comprovarLimit = ({obj, volum }) => {
  if (obj.x >= volum || obj.y >= volum) return true;
  if (obj.x < 0 || obj.y < 0) return true;
  return false;
};

//[x] funció per a saber si xoquem amb serp
// entrada: objecte 1 (cap de la serp) i coordenades noves
// eixida: booleà
const comprovarSerp = ({ coord, obj }) => {
  obj.forEach((element) => {
    if ((element.x === coord.x) & (element.y === coord.y)) return true;
  });
  return false;
};

//[x] Funció per a disminuir la serp
// entrada: Serp <Array<objecte(x,y,pos,estat)>>
// eixida: NOU OBJECTE SERP
// NOTE com a eixida una còpia del canvas? un array amb la nova serp -implicaria que cada vegada que disminuira es tinguera que col·locar novament en el canvas, tenint que fer un nou mètode.
const disminuir = (serp) => {
  if (!Array.isArray(serp)) return null;

  if (serp.some((s) => !s.pos || !s.x || !s.y)) return null;

  let copiaSerp = structuredClone(serp);
  return copiaSerp.pop();
};

//[x] Funció d'afegir poma
// entrada: serp i poma
// eixida: poma
export const afegirPoma = ({serp, volum }) => {
  console.log(serp);
    if (!serp || !Array.isArray(serp)) {
    throw new Error("Serp no està inicialitzada correctament");
  }
  if (serp.length === Math.sqrt(volum)) return finalitzarJoc();

  let arrCasellesLliures = Array(volum).fill(null).map((_, x) =>
    new Array(volum).fill(null).map((_, y) => ({
      x: x,
      y: y
    }))
  ).flat().filter(e => !comprovarSerp({coord: e, obj: serp}));

    let pos = Math.floor(Math.random()*arrCasellesLliures.length);
    console.log(arrCasellesLliures);
    
    let novaPoma = structuredClone(arrCasellesLliures[pos]);
console.log(novaPoma);

  novaPoma.estat = "poma";

  return novaPoma;
};

//[x] Funció per a canviar l'estat/esborrar d'una casella
// entrada: cooredenades de la casella i forma a canviar
// eixida: copia de l'objecte
const resetCasella = (object) => {
  let nouObject = structuredClone(object);
  nouObject.estat = null;
  nouObject.pos = 0;
  return nouObject;
};

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
// eixida: una string: objectes a eliminar-objectes a canviar


