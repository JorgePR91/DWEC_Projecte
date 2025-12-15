import styles from "../../../style.scss?inline";
import { BehaviorSubject, map, combineLatest, interval } from "rxjs";
import { guardarPartida, obtenirPartida, eliminarPartida } from "../../../services/backendapiservice.js";

class AppGame extends HTMLElement {
  static get observedAttributes() {
    return ["volum"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._subsJoc = [];
    this._bucleJoc = null;
    this._volum = 10;
    this._partidaCarregada = null;
    this._partidaId = null;
  }

  async connectedCallback() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    this._partidaId = urlParams.get('partida_id');

    // Si hay una partida_id, cargarla
    if (this._partidaId) {
      try {
        this._partidaCarregada = await obtenirPartida(this._partidaId);
        this._volum = this._partidaCarregada.volum;
      } catch (error) {
        console.error("Error carregant la partida:", error);
        this._partidaCarregada = null;
        this._partidaId = null;
      }
    }

    this._init();
  }

  disconnectedCallback() {
    if (this._bucleJoc) this._bucleJoc();
    this.detachEventListeners();
    this.$estat = null;
    this.$direccio = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "volum" && newValue) {
      this._volum = parseInt(newValue);
    }
  }

  _init() {
    this._volum = parseInt(this.getAttribute("volum")) || 10;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(link);
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
    this.shadowRoot.appendChild(this.render(this._volum));

    this.setupButtonListeners();
    this._bucleJoc = this.inici(this._volum);

    this.setupEventListeners();
    this.attachEventListeners();
  }

  render() {
    const section = document.createElement("section");
    section.setAttribute("id", "sectionGame");

    const puntuacio = document.createElement("div");
    puntuacio.setAttribute("id", "divPuntuacio");
    puntuacio.classList.add("d-flex");
    puntuacio.classList.add("align-items-center");
    puntuacio.classList.add("justify-items-center");
    puntuacio.classList.add("mb-4");
    puntuacio.classList.add("fs-3");
    puntuacio.classList.add("glow-text");
    puntuacio.classList.add("mx-auto");

    const input = document.createElement("input");
    input.setAttribute("id", "puntuacio");
    input.setAttribute("name", "puntuacio");
    input.setAttribute("style", "width: 3em !important;");
    input.classList.add("form-control");
    input.classList.add("d-inline-bloc");
    input.classList.add("input-no-interactivo");
    input.classList.add("bg-transparent");
    input.classList.add("border-0");
    input.classList.add("text-end");
    input.classList.add("text-white");
    input.classList.add("fs-3");

    const label = document.createElement("label");
    label.setAttribute("for", "puntuacio");
    label.classList.add("form-label");
    label.classList.add("m-0");
    label.textContent = "Puntuació";

    puntuacio.classList.add("align-content-center");
    puntuacio.classList.add("justify-content-center");
    label.classList.add("justify-items-center");
    input.classList.add("align-items-center");
    input.classList.add("justify-items-center");

    puntuacio.append(label, input);

    const div = document.createElement("div");
    div.setAttribute("id", "gameContainer");
    div.classList.add("container");
    div.classList.add("board-wrapper");
    div.classList.add("rounded");
    div.classList.add("mb-5");

    div.appendChild(this.renderCanvas(this._volum));

    section.append(puntuacio, div);

    const button = document.createElement("button");
    button.setAttribute("id", "btnInici");
    button.textContent = "Inici";
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("text-black");
    section.append(button);

    return section;
  }

  renderCanvas(volum = 30) {
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
    div.classList.add("glow-effect", "board");

    div.innerHTML = contingut;
    return div;
  }

  setupButtonListeners() {
    const button = this.shadowRoot.querySelector("#btnInici");
    if (!button) return;

    button.addEventListener("click", () => {
      if (this._bucleJoc) this._bucleJoc();

      const gameContainer = this.shadowRoot.querySelector("#gameContainer");
      const oldCanvas = gameContainer.querySelector("#gameCanvas");

      if (gameContainer && oldCanvas) {
        gameContainer.replaceChild(this.renderCanvas(this._volum), oldCanvas);
      }

      this._bucleJoc = this.inici(this._volum);
    });
  }

  setupEventListeners() {
    this._eventTecles = (event) => {
      const estatAct = this.$estat?.getValue();
      if (!estatAct) return;

      if (estatAct === "parat") this.$estat.next("jugant");

      switch (event.key) {
        case "ArrowUp":
          this.$direccio.next("dalt");
          break;
        case "ArrowRight":
          this.$direccio.next("dreta");
          break;
        case "ArrowDown":
          this.$direccio.next("baix");
          break;
        case "ArrowLeft":
          this.$direccio.next("esquerra");
          break;
        case " ":
          if (estatAct === "jugant") this.$estat.next("guardat");
          else if (estatAct === "guardat") this.$estat.next("jugant");
          break;
      }
    };
  }

  attachEventListeners() {
    document.addEventListener("keydown", this._eventTecles);
  }

  detachEventListeners() {
    document.removeEventListener("keydown", this._eventTecles);
  }

  reset() {
    if (this._bucleJoc) this._bucleJoc();
    this.detachEventListeners();

    this.shadowRoot.innerHTML = "";
    this._init();
  }

  inici(volum) {
    const { $serp, $poma, $direccio, $estat, $punts } = this.iniciJoc(volum);

    // guardar referencias para eventos
    this.$estat = $estat;
    this.$direccio = $direccio;

    let canvas = this.shadowRoot.querySelector("#gameCanvas");
    let section = this.shadowRoot.querySelector("#sectionGame");

    let serpAntiga = [];
    let pomaAntiga = null;

    this._subsJoc.push(
      $serp.subscribe((serp) => {
        this.actualitzarSerp({
          antic: serpAntiga,
          nou: serp,
          contenidor: canvas,
        });
        serpAntiga = structuredClone(serp);
      })
    );

    this._subsJoc.push(
      $poma.subscribe((poma) => {
        if (pomaAntiga)
          this.borrar({ coord: pomaAntiga, forma: "poma", contenidor: canvas });

        this.pintar({ coord: poma, forma: "poma", contenidor: canvas });
        pomaAntiga = structuredClone(poma);
      })
    );

    this._subsJoc.push(
      $punts.subscribe(
        (e) => e > 0 && (section.querySelector("#puntuacio").value = e)
      )
    );

    // Suscripción al estado para guardar la partida cuando se pulse espacio
    this._subsJoc.push(
      $estat.subscribe((estat) => {
        if (estat === "guardat") {
          this.guardarEstatPartida({
            serp: $serp.getValue(),
            poma: $poma.getValue(),
            direccio: $direccio.getValue(),
            punts: $punts.getValue(),
            volum: volum,
          });
        }
      })
    );

    const subsBucle = this.bucle({
      $serp,
      $poma,
      $direccio,
      $estat,
      $punts,
      volum,
    });
    this._subsJoc.push(subsBucle);

    return () => {
      this._subsJoc.forEach((sub) => sub.unsubscribe());
      this._subsJoc = [];
    };
  }

  disminuir(serp) {
    if (!Array.isArray(serp))
      throw new Error("Serp no està inicialitzada correctament");

    console.log("DISMINUIR");

    const copiaSerp = structuredClone(serp);
    copiaSerp.pop();
    return copiaSerp;
  }

  /**
   * Guarda el estado actual de la partida en Supabase
   * @param {Object} estatPartida - Estado de la partida
   */
  async guardarEstatPartida(estatPartida) {
    try {
      console.log("Guardant partida...", estatPartida);

      const resultat = await guardarPartida(estatPartida);

      console.log("Partida guardada correctament!", resultat);

      // Mostrar feedback visual al usuario
      const section = this.shadowRoot.querySelector("#sectionGame");
      const missatge = document.createElement("div");
      missatge.textContent = "✓ Partida guardada";
      missatge.classList.add("alert", "alert-success", "position-fixed", "top-0", "start-50", "translate-middle-x", "mt-3");
      missatge.style.zIndex = "9999";
      section.appendChild(missatge);

      // Eliminar el mensaje después de 2 segundos
      setTimeout(() => {
        missatge.remove();
      }, 2000);

    } catch (error) {
      console.error("Error guardant la partida:", error);

      // Mostrar error al usuario
      const section = this.shadowRoot.querySelector("#sectionGame");
      const missatge = document.createElement("div");
      missatge.textContent = "✗ Error guardant la partida";
      missatge.classList.add("alert", "alert-danger", "position-fixed", "top-0", "start-50", "translate-middle-x", "mt-3");
      missatge.style.zIndex = "9999";
      section.appendChild(missatge);

      setTimeout(() => {
        missatge.remove();
      }, 2000);
    }
  }

  bucle({ $serp, $poma, $direccio, $punts, $estat, volum }) {
    return interval(150).subscribe(() => {
      let estatAct = $estat.getValue();

      if (estatAct === "parat") {
        return;
      }

      if (estatAct !== "jugant") {
        console.log("NO JUGANT");
        return;
      }

      let serpAct = $serp.getValue();
      let pomaAct = $poma.getValue();
      let direccioAct = $direccio.getValue();
      let puntsAct = $punts.getValue();
      console.log(serpAct);

      if (!serpAct || !Array.isArray(serpAct) || serpAct.length === 0) {
        throw new Error("Serp no està inicialitzada correctament");
      }

      let coordNoves = this.moviment(direccioAct)({
        x: serpAct[0].x,
        y: serpAct[0].y,
      });

      if (!coordNoves) return;

      if (this.comprovarLimit({ obj: coordNoves, volum })) {
        serpAct = this.disminuir(serpAct);

        if (!serpAct || serpAct.length === 0) {
          console.log("Finalitzat per haver acabat amb la serp");
          this.finalitzarJoc($estat);
          return;
        }

        $serp.next(serpAct);
        puntsAct--;
        $punts.next(puntsAct);
        return;
      }

      if (this.comprovarObj({ coord: coordNoves, obj: serpAct.slice(1) })) {
        console.log("Colisió interna");

        serpAct = this.disminuir(serpAct);

        if (!serpAct || serpAct.length === 0) {
          this.finalitzarJoc($estat);
          return;
        }

        $serp.next(serpAct);
        puntsAct--;
        $punts.next(puntsAct);
        return;
      }

      if (this.comprovarObj({ coord: coordNoves, obj: [pomaAct] })) {
        console.log("Poma menjada");

        serpAct = this.creixerSerp({ serp: serpAct, estat: $estat })(volum)(
          coordNoves
        );
        pomaAct = this.afegirPoma({ serp: serpAct, estat: estatAct, volum });
        $poma.next(pomaAct);
        puntsAct++;
        $punts.next(puntsAct);
      } else {
        serpAct = this.creixerSerp({ serp: serpAct, estat: $estat })(volum)(
          coordNoves
        );
        serpAct.pop();
      }

      $serp.next(serpAct);
    });
  }

  creixerSerp({ serp, estat }) {
    let serpAugmentada = structuredClone(serp);

    return (volum) => {
      if (serpAugmentada.length === Math.sqrt(volum))
        return () => {
          this.finalitzarJoc(estat);
          return serpAugmentada;
        };
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
    };
  }

  moviment(direccio) {
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
    };
  }

  async finalitzarJoc(estat) {
    estat.next("finalitzat");
    console.log("S'acabó");

    // Si hay una partida cargada, eliminarla de la base de datos
    if (this._partidaId) {
      try {
        await eliminarPartida(this._partidaId);
        console.log("Partida eliminada de la base de dades");
        this._partidaId = null;
        this._partidaCarregada = null;

        // Mostrar mensaje al usuario
        const section = this.shadowRoot.querySelector("#sectionGame");
        if (section) {
          const missatge = document.createElement("div");
          missatge.textContent = "✓ Partida finalitzada i eliminada";
          missatge.classList.add("alert", "alert-info", "position-fixed", "top-0", "start-50", "translate-middle-x", "mt-3");
          missatge.style.zIndex = "9999";
          section.appendChild(missatge);

          setTimeout(() => {
            missatge.remove();
          }, 3000);
        }
      } catch (error) {
        console.error("Error eliminant la partida:", error);
      }
    }
  }

  afegirPoma({ serp, volum }) {
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
      .filter((e) => !this.comprovarObj({ coord: e, obj: serp }));

    let pos = Math.floor(Math.random() * arrCasellesLliures.length);

    let novaPoma = structuredClone(arrCasellesLliures[pos]);

    novaPoma.estat = "poma";
    return novaPoma;
  }

  iniciJoc(volum) {
    // Si hay una partida cargada, usar sus datos
    let dadesInicials;
    if (this._partidaCarregada) {
      dadesInicials = {
        serp: this._partidaCarregada.serp,
        poma: this._partidaCarregada.poma,
        direccio: this._partidaCarregada.direccio,
        punts: this._partidaCarregada.punts
      };
      console.log("Carregant partida guardada:", dadesInicials);
    } else {
      dadesInicials = {
        serp: [{
          x: Math.floor(volum / 2),
          y: Math.floor(volum / 2),
          estat: "serp",
          pos: 1,
        }],
        poma: null,
        direccio: "estatic",
        punts: 0
      };
    }

    const $serp = new BehaviorSubject(dadesInicials.serp);

    const $poma = new BehaviorSubject(
      dadesInicials.poma || this.afegirPoma({ serp: $serp.getValue(), volum: volum })
    );

    const $direccio = new BehaviorSubject(dadesInicials.direccio);

    //parat, guardat, jugant
    const $estat = new BehaviorSubject("parat");
    const $punts = new BehaviorSubject(dadesInicials.punts);

    const $joc = combineLatest([$serp, $poma, $direccio, $estat, $punts]).pipe(
      map(([serp, poma, direccio, estat, punts]) => ({
        serp,
        poma,
        direccio,
        estat,
        punts,
      }))
    );
    //iniciar el bucle
    console.log("iniciat el joc");

    return { $serp, $poma, $direccio, $estat, $punts, $joc };
  }

  comprovarLimit({ obj, volum }) {
    if (obj.x >= volum || obj.y >= volum) return true;
    if (obj.x < 0 || obj.y < 0) return true;
    return false;
  }

  comprovarObj({ coord, obj }) {
    const array = Array.isArray(obj) ? obj : [obj];

    return array.some(
      (element) => element.x === coord.x && element.y === coord.y
    );
  }

  pintar({ coord, forma, contenidor }) {
    let id = "x" + coord.x + "y" + coord.y;
    let casella = contenidor.querySelector(`#${id}`);

    if (casella) casella.classList.add(forma);

    return contenidor;
  }

  borrar({ coord, forma, contenidor }) {
    let id = "x" + coord.x + "y" + coord.y;
    let casella = contenidor.querySelector(`#${id}`);

    if (casella) {
      //console.log("A borrar " + "#" + id + " forma: " + forma);

      casella.classList.remove(forma);

      //console.log(casella);
    }
    return contenidor;
  }

  actualitzarSerp({ antic, nou, contenidor }) {
    if (!Array.isArray(nou) || nou.length === 0) return;

    if (!Array.isArray(antic) || antic.length === 0) {
      console.log("serp inicial");

      return nou.forEach((e) =>
        this.pintar({
          coord: { x: e.x, y: e.y },
          forma: "serp",
          contenidor: contenidor,
        })
      );
    }

    const nouSet = new Set(nou.map((e) => `${e.x},${e.y}`));
    const anticSet = new Set(antic.map((e) => `${e.x},${e.y}`));

    antic.forEach(
      (e) =>
        !nouSet.has(`${e.x},${e.y}`) &&
        this.borrar({
          coord: { x: e.x, y: e.y },
          forma: "serp",
          contenidor: contenidor,
        })
    );
    nou.forEach(
      (e) =>
        !anticSet.has(`${e.x},${e.y}`) &&
        this.pintar({
          coord: { x: e.x, y: e.y },
          forma: "serp",
          contenidor: contenidor,
        })
    );

    return contenidor;
  }
}

customElements.define("app-game", AppGame);
