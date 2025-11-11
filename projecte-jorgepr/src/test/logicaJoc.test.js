/**
 * @vitest-environment jsdom
 */

import { describe, expect, test } from "vitest";

import * as llogicaJoc from "../game/logicaJoc.js";

const serp = [
  {
    x: 2,
    y: 2,
    estat: null,
    pos: 1,
  },
  {
    x: 2,
    y: 3,
    estat: null,
    pos: 2,
  },
  {
    x: 2,
    y: 4,
    estat: null,
    pos: 3,
  },
  {
    x: 2,
    y: 5,
    estat: null,
    pos: 4,
  },
  {
    x: 2,
    y: 6,
    estat: null,
    pos: 5,
  },
];

const serpIncom = [
  {
    x: 2,
    y: 2,
    estat: null,
    pos: 1,
  },
  {
    x: 2,
    y: 3,
    estat: null,
    pos: 2,
  },
  {
    x: 2,
    y: 4,
    estat: null,
    pos: 3,
  },
  {
    x: 2,
    y: 5,
    estat: null,
    pos: 4,
  },
  {
    x: 2,
    y: 6,
    estat: null,
    pos: 0,
  },
];

const serpErroni = [
  {
    x: 2,
    estat: null,
    pos: 1,
  },
  {
    x: 2,
    y: 3,
    estat: null,
    pos: 2,
  },
  {
    x: 2,
    y: 4,
    estat: null,
    pos: 3,
  },
];

describe("Llògica del joc", function () {
      //[ ]La funció moviment
  describe("Loop Joc - funció moviment", function () {
    test("La funció loopJoc és una closure", function () {
      let funcio = llogicaJoc.moviment();
      expect(typeof funcio).toBe("funciton");
    });
    test("La primera instància genera el tauler però sense moviment ni canvi", function () {
      //Accedir a l'element de dins de la closure
    });
    test("La funció loopJoc s'activa amb el moviment", function () {
    });
    test("La funció loopJoc no s'activa amb altre tipus de paràmetre", function () {});
  });
// [x] Funció de disminució de la serp
  describe("Funció de disminució de la serp", function () {
    test("La funcuió disminuir sols accepta un array d'objectes", function () {
      expect(llogicaJoc.disminuir(5)).toBeNull();
      expect(llogicaJoc.disminuir("putosTest")).toBeNull();
      expect(llogicaJoc.disminuir({ nom: "serp" })).toBeNull();
      expect(llogicaJoc.disminuir(serpErroni)).toBeNull();
      expect(llogicaJoc.disminuir(serpIncom)).toBeNull();
      expect(llogicaJoc.disminuir(serp)).not.toBeNull();
    });
    test("La funció disminuir no toca el array original", function () {
      let serpArray = llogicaJoc.disminuir(serp);
      expect(serpArray).not.toEqual(serp);
    });
    test("La funció disminuir torna un array d'objectes", function () {
      let serpArray = llogicaJoc.disminuir(serp);
      expect(Array.isArray(serpArray)).toBeTruthy();
    });
    test("La funció disminuir torna un array d'objectes amb els atributs de la serp", function () {
      let serpArray = llogicaJoc.disminuir(serp);
      expect(serpArray.any(s => !s.pos || !s.x || !s.y)).toBeTruthy();
    });
    test(
      "La funció disminuir torna un array d'objectes amb l'última possició diferent a la primera", function () {
              let serpArray = llogicaJoc.disminuir(serp);
        expect(serpArray.length).not.toEqual(serp.length);
        expect(llogicaJoc.disminuir(serp)).toBe([
        {
          x: 2,
          y: 2,
          estat: null,
          pos: 1,
        },
        {
          x: 2,
          y: 3,
          estat: null,
          pos: 2,
        },
        {
          x: 2,
          y: 4,
          estat: null,
          pos: 3,
        },
        {
          x: 2,
          y: 5,
          estat: null,
          pos: 4,
        },
      ]);
      }
    );
// [ ] Funció de 

  });
});
