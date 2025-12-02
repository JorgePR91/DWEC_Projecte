export { iniciJoc, bucle, disminuir, creixerSerp, comprovarObj, comprovarLimit, afegirPoma, moviment };
import { BehaviorSubject, map, combineLatest, interval } from "rxjs";
// TODO Decidir si separem la part lògica de la visual: esdeveniment personalitzat per a que carregue: un document per al container i altre per al joc i en el moment que la matriu del joc canvie li enviem l'esdeveniment personalitzat al carregar el canvas.
// Saber què carregaria millor el navegador: canviar l'estil de les casselles o divs vs canviar la classe; canviar sols les casselles afectades o tot el tauler

//SERP ÉS UN ARRAY D'OBJECTES
//POMA ÉS UN OBJECTE

const iniciJoc = (volum) => {

  const $serp = new BehaviorSubject([{
    x: Math.floor(volum / 2),
    y: Math.floor(volum / 2),
    estat: "serp",
    pos: 1,
  }]);

  const $poma = new BehaviorSubject(
    afegirPoma({ serp: $serp.getValue(), volum: volum })
  );

  const $direccio = new BehaviorSubject("estatic");


  //parat, guardat, jugant
  const $estat = new BehaviorSubject("parat");
  const $punts = new BehaviorSubject(0);

  const $joc = combineLatest([$serp, $poma, $direccio, $estat, $punts])
    .pipe(
    map(([serp, poma, direccio, estat, punts]) => ({
      serp,
      poma,
      direccio,
      estat,
      punts
    }))
  );
  //iniciar el bucle
console.log("iniciat el joc");

  return { $serp, $poma, $direccio, $estat, $punts, $joc };
};




//[ ] Bucle del juego
// Calcular el nuevo estado (movimiento).
// Actualizar las variables de estado.
// Redibujar el canvas.

const bucle = ({ $serp, $poma, $direccio, $punts, $estat, volum}) => {

  return interval(500).subscribe(() => {
    let estatAct = structuredClone($estat.getValue());
    if(estatAct !== "jugant") return;

    let serpAct = structuredClone($serp.getValue());
    let pomaAct = structuredClone($poma.getValue());
    let direccioAct = structuredClone($direccio.getValue());
    let puntsAct = structuredClone($punts.getValue());

    let coordNoves = moviment(direccioAct)({x: serpAct[0].x, y: serpAct[0].y});

    if(!coordNoves) return;

    if(comprovarLimit({obj: coordNoves, volum})) {
      if(!serpAct || serpAct.length === 0){
        finalitzarJoc($estat)
        return;
      }
      disminuir(serpAct); return
    }
    if(comprovarObj({ coord: coordNoves, obj: serpAct })) {
            if(!serpAct || serpAct.length === 0){
        finalitzarJoc($estat)
        return;
      }
      disminuir(serpAct); return}
    if(comprovarObj({ coord: coordNoves, obj: [pomaAct] })) {
      serpAct = creixerSerp(serpAct)(volum)(coordNoves); 
      pomaAct = afegirPoma({serp: serpAct, estat: estatAct, volum});
      $poma.next(pomaAct);
      puntsAct++;
      $punts.next(puntsAct);
    } else {
        serpAct = creixerSerp(serpAct)(volum)(coordNoves); 
        serpAct.pop();
    }

    $serp.next(serpAct);
  });
};


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
};
//[ ] FUNCIONS DE MOVIEMNT DE LA SERP
// entrada: l'esdeveniment i el canvas html
// internament: sols toca el canvas intern
// eixida: res
// NOTE pot retornar una còpia així no modifica el paràmetre rebut. 
// NOTE si es vol impedir anar en contra d'ella, de dalt baix, per exemple i que no choque posem un comprovarObj abans d'enviar 
const moviment = (direccio) => {
  let coordNoves;

  return (element) => {
      switch (direccio) {
    case "dalt":
      coordNoves = { x: element.x, y: element.y - 1 };
      break;
    case "dreta":
      coordNoves = { x: element.x + 1, y: element.y };
      break;
    case "baix":
      coordNoves = { x: element.x, y: element.y + 1 };
      break;
    case "esquerra":
      coordNoves = { x: element.x - 1, y: element.y };
      break;
    default:
      return;
  }
    return coordNoves;
  }
}


// function sobrant() {
//   let cap = serp.filter((element) => element.pos === 1)[0];

//   if (!cap) finalitzarJoc();

//   if (
//     comprovarLimit({ obj: coordNoves, volum }) ||
//     comprovarSerp({ coord: coordNoves, obj: serp })
//   ) {
//     let novaSerp = disminuir(serp);
//     return { novaSerp, poma };
//   }

//   if (comprovarSerp({ coord: coordNoves, obj: [poma] })) {
//     let novaSerp = creixerSerp({ coordNoves, serp });
//     let novaPoma = afegirPoma(novaSerp);

//     return { novaSerp, novaPoma };
//   }

//   let novaSerp = creixerSerp({ coordenades: coordNoves, serp });

//   return { novaSerp, poma };
// }

//[x] funció per a créixer la serp
// entrada: objecte 1 (serp) i coordenades a augmentar
// eixida: cópia de serp

const creixerSerp = (serp) => {
  let serpAugmentada = structuredClone(serp);

  return (volum) => {
      if (serpAugmentada.length === Math.sqrt(volum)) return finalitzarJoc("perdut");
        return (coordenades) => {
    serpAugmentada.forEach((part) => part.pos++);
    serpAugmentada.unshift({
      x: coordenades.x,
      y: coordenades.y,
      estat: "serp",
      pos: 1,
    });
    return serpAugmentada;
  };
  }


};

//[x] funció per a saber si estem en el límit
// entrada: objecte 1 (cap de la serp) i canvas intern
// eixida: booleà
// NOTE fer-ho dins del mètode de moviment amb una ternària?
const comprovarLimit = ({ obj, volum }) => {
  if (obj.x >= volum || obj.y >= volum) return true;
  if (obj.x < 0 || obj.y < 0) return true;
  return false;
};

//[x] funció per a saber si xoquem amb serp
// entrada: objecte 1 (cap de la serp) i coordenades noves
// eixida: booleà
const comprovarObj = ({ coord, obj }) => {
    const array = Array.isArray(obj) ? obj : [obj];

  return array.some((element) => 
    element.x === coord.x && element.y === coord.y
  );
};

//[x] Funció per a disminuir la serp
// entrada: Serp <Array<objecte(x,y,pos,estat)>>
// eixida: NOU OBJECTE SERP
// NOTE com a eixida una còpia del canvas? un array amb la nova serp -implicaria que cada vegada que disminuira es tinguera que col·locar novament en el canvas, tenint que fer un nou mètode.
const disminuir = (serp) => {
  if (!Array.isArray(serp)) return null;
  else if (serp.some(s => !s.pos || !s.x || !s.y)) return null;

  const copiaSerp = structuredClone(serp);
  copiaSerp.pop();
  //copiaSerp.slice(0,-1)
  return copiaSerp;
};

//[x] Funció d'afegir poma
// entrada: serp i poma
// eixida: poma
const afegirPoma = ({ serp, estat, volum }) => {

  if (!serp || !Array.isArray(serp)) {
    throw new Error("Serp no està inicialitzada correctament");
  }

  let arrCasellesLliures = Array(volum)
    .fill(null)
    .map((_, x) =>
      new Array(volum).fill(null).map((_, y) => ({
        x: x,
        y: y,
      }))
    )
    .flat()
    .filter((e) => !comprovarObj({ coord: e, obj: serp }));

  let pos = Math.floor(Math.random() * arrCasellesLliures.length);

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
function finalitzarJoc(estat) {
  estat.next("finalitzat");
  console.log("S'acabó");
}

//[ ] Mètode per a enviar el resultat
// entrada:
// eixida: una string: objectes a eliminar-objectes a canviar
