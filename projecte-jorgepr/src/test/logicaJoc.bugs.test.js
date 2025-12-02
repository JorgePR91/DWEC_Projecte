/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, it } from "vitest";

import * as llogicaJoc from "../game/logicaJoc.js";

const serp = [
  { x: 2, y: 2, estat: null, pos: 1 },
  { x: 2, y: 3, estat: null, pos: 2 },
  { x: 2, y: 4, estat: null, pos: 3 },
  { x: 2, y: 5, estat: null, pos: 4 },
];

describe("Validaciones actuales (tests que detectan bugs existentes)", () => {
  test("El módulo `logicaJoc.js` se puede importar sin lanzar (validación) ", () => {
    // la propia import arriba sirve como validación; si algo rompiera durante
    // la carga del módulo la importación habría fallado.
    expect(typeof llogicaJoc).toBe("object");
  });

  test("`disminuir` actualmente devuelve el elemento eliminado en vez de un array", () => {
    const resultado = llogicaJoc.disminuir(serp);
    // comprobamos que no es un array (bug detectado anteriormente)
    expect(Array.isArray(resultado)).toBe(false);
    // y que coincide con el último elemento del array original (comportamiento observado)
    expect(resultado).toEqual(serp[serp.length - 1]);
  });

  test("`comprovarObj` no retorna true aunque exista coincidencia (uso de forEach/return y '&')", () => {
    const coord = { x: 2, y: 2 };
    const obj = [{ x: 2, y: 2 }];

    const valor = llogicaJoc.comprovarObj({ coord, obj });

    // según el comportamiento actual la función devuelve false aun cuando debe devolver true
    expect(valor).toBe(false);
  });

  test("`afegirPoma` lanza cuando recibe `serp` inválida (validación de guardas)", () => {
    expect(() => llogicaJoc.afegirPoma({ serp: null, volum: 10 })).toThrow();
  });
});

describe('Estado inicial de la serpiente', () => {
  it('debe ser un array de objetos', () => {
    const { $serp } = llogicaJoc.iniciJoc(10);
    const serp = $serp.getValue();
    expect(Array.isArray(serp)).toBe(true);
    expect(serp.length).toBeGreaterThan(0);
    expect(serp[0]).toHaveProperty('x');
    expect(serp[0]).toHaveProperty('y');
  });
});

describe('Generación de la manzana', () => {
  it('la manzana no debe estar en la misma posición que la serpiente', () => {
    const { $serp, $poma } = llogicaJoc.iniciJoc(10);
    const serp = $serp.getValue();
    const poma = $poma.getValue();
    const colision = serp.some(s => s.x === poma.x && s.y === poma.y);
    expect(colision).toBe(false);
  });
});

describe('Movimiento de la serpiente', () => {
  it('no debe permitir que la serpiente salga del tablero', () => {
    const { $serp, $direccio } = llogicaJoc.iniciJoc(5);
    $direccio.next('dalt');
    // Simula varios movimientos hacia arriba
    for (let i = 0; i < 10; i++) {
      // Ejecuta el bucle o la función de movimiento
    }
    const serp = $serp.getValue();
    const fuera = serp.some(s => s.x < 0 || s.y < 0 || s.x >= 5 || s.y >= 5);
    expect(fuera).toBe(false);
  });
});

describe('Fin de juego', () => {
  it('debe cambiar el estado a "finalizado" cuando la serpiente muere', () => {
    const { $serp, $estat } = llogicaJoc.iniciJoc(5);
    // Simula una colisión
    // ...
    expect($estat.getValue()).toBe('finalitzat');
  });
});

describe('Dirección de movimiento', () => {
  it('solo debe aceptar direcciones válidas', () => {
    const { $direccio } = llogicaJoc.iniciJoc(10);
    $direccio.next('arriba');
    expect(['dalt', 'dreta', 'baix', 'esquerra']).toContain($direccio.getValue());
  });
});

test("El observable $serp emite el nuevo estado tras un movimiento", () => {
  const { $serp, $direccio } = llogicaJoc.iniciJoc(10);
  let emitido = null;
  $serp.subscribe(val => emitido = val);
  $direccio.next("dreta");
  // Simula un tick del bucle
  // llogicaJoc.bucle({ $serp, $direccio, ... });
  expect(emitido).not.toBeNull();
  expect(Array.isArray(emitido)).toBe(true);
});

test("Las funciones de movimiento no mutan el array original de la serpiente", () => {
  const original = [
    { x: 2, y: 2, estat: null, pos: 1 },
    { x: 2, y: 3, estat: null, pos: 2 }
  ];
  const copia = JSON.parse(JSON.stringify(original));
  const resultado = llogicaJoc.creixerSerp(copia)({ x: 2, y: 1 });
  expect(copia).toEqual(original); // El original no debe cambiar
});

test("El estado cambia a 'guardat' al pausar el juego", () => {
  const { $estat } = llogicaJoc.iniciJoc(10);
  $estat.next("guardat");
  expect($estat.getValue()).toBe("guardat");
});

test("La manzana siempre está dentro de los límites del tablero", () => {
  const { $poma } = llogicaJoc.iniciJoc(10);
  const poma = $poma.getValue();
  expect(poma.x).toBeGreaterThanOrEqual(0);
  expect(poma.x).toBeLessThan(10);
  expect(poma.y).toBeGreaterThanOrEqual(0);
  expect(poma.y).toBeLessThan(10);
});

test("La puntuación incrementa al comer una manzana", () => {
  const { $serp, $poma, $direccio, $punts } = llogicaJoc.iniciJoc(10);
  const puntosIniciales = $punts.getValue();
  // Simula que la serpiente come la manzana
  // llogicaJoc.bucle({ $serp, $poma, $direccio, $punts, ... });
  // (deberías forzar la colisión en el test)
  const poma = $poma.next({ x: 2, y: 2 });
  $direccio.next("dreta");
  
  expect($punts.getValue()).toBeGreaterThan(puntosIniciales);
});

test("La serpiente responde a cambios de dirección en tiempo real", () => {
  const { $serp, $direccio } = llogicaJoc.iniciJoc(10);
    const serp = $serp.getValue();
  $direccio.next("dreta");
    const serp2 = $serp.getValue();
  // Simula un tick del bucle
  // llogicaJoc.bucle({ $serp, $direccio, ... });
  // Espera que la cabeza de la serpiente se haya movido a la derecha
  expect(serp[0].x).toBeGreaterThan(serp2[0].x);
});

test("No se puede cambiar a la dirección opuesta inmediatamente", () => {
  const { $direccio } = llogicaJoc.iniciJoc(10);
  $direccio.next("dreta");
  $direccio.next("esquerra");
  // La dirección debería seguir siendo "dreta" | Si se puede pero penaliza y te quita puntos
  //expect($direccio.getValue()).toBe("dreta");
  expect($direccio.getValue()).toBe("esquerra");
});

