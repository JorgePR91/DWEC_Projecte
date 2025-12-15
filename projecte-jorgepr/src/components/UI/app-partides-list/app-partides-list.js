import { obtenirPartides, eliminarPartida } from "../../../services/backendapiservice.js";
import styles from "../../../style.scss?inline";

class AppPartidesList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._partides = [];
  }

  async connectedCallback() {
    await this.carregarPartides();
    this.render();
  }

  async carregarPartides() {
    try {
      this._partides = await obtenirPartides();
    } catch (error) {
      console.error("Error carregant partides:", error);
      this._partides = [];
    }
  }

  async eliminarPartidaHandler(partidaId) {
    if (!confirm("Estàs segur que vols eliminar aquesta partida?")) {
      return;
    }

    try {
      await eliminarPartida(partidaId);

      await this.carregarPartides();
      this.render();

      this.mostrarMissatge("Partida eliminada correctament", "success");
    } catch (error) {
      console.error("Error eliminant partida:", error);
      this.mostrarMissatge("Error eliminant la partida", "danger");
    }
  }

  carregarPartidaHandler(partidaId, volum) {
    window.location.hash = `#game?volum=${volum}&partida_id=${partidaId}`;
  }

  mostrarMissatge(text, tipus = "success") {
    const missatge = document.createElement("div");
    missatge.textContent = text;
    missatge.classList.add("alert", `alert-${tipus}`, "position-fixed", "top-0", "start-50", "translate-middle-x", "mt-3");
    missatge.style.zIndex = "9999";

    this.shadowRoot.appendChild(missatge);

    setTimeout(() => {
      missatge.remove();
    }, 2000);
  }

  formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  render() {
    this.shadowRoot.innerHTML = "";

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    this.shadowRoot.appendChild(link);

    const codi = `
      <div class="card bg-dark text-light border-secondary glow-effect cardClass p-4">
        <div class="card-header mb-4">
          <h3 class="card-title glow-text fw-bold">Les meues partides</h3>
          <p class="card-description">Gestiona les partides guardades</p>
        </div>
        <div class="card-content">
          ${this._partides.length === 0 ? `
            <div class="text-center text-muted py-5">
              <p class="fs-5">No tens partides guardades</p>
              <p class="small">Comença a jugar i guarda la teua primera partida prement espai durant el joc!</p>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Tauler</th>
                    <th>Punts</th>
                    <th>Direcció</th>
                    <th>Data guardada</th>
                    <th class="text-center">Accions</th>
                  </tr>
                </thead>
                <tbody>
                  ${this._partides.map(partida => `
                    <tr>
                      <td>${partida.volum}x${partida.volum}</td>
                      <td><span class="badge bg-primary">${partida.punts}</span></td>
                      <td>${this.getDireccioIcon(partida.direccio)}</td>
                      <td class="small text-muted">${this.formatarData(partida.data_guardat)}</td>
                      <td class="text-center">
                        <button
                          class="btn btn-sm btn-success me-2 btn-carregar"
                          data-id="${partida.id}"
                          data-volum="${partida.volum}">
                          ▶ Carregar
                        </button>
                        <button
                          class="btn btn-sm btn-danger btn-eliminar"
                          data-id="${partida.id}">
                          🗑 Eliminar
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
          <div class="text-center mt-4">
            <a href="#profile" class="btn btn-secondary">← Tornar al perfil</a>
          </div>
        </div>
      </div>
    `;

    const template = document.createElement("template");
    template.innerHTML = codi;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);
    this.shadowRoot.adoptedStyleSheets = [styleSheet];

    // Afegir estils adicionals per a la taula
    const styleExtra = document.createElement("style");
    styleExtra.textContent = `
      .table {
        color: hsl(180, 100%, 95%);
      }
      .table-hover tbody tr:hover {
        background-color: hsla(180, 100%, 50%, 0.1);
      }
      .card-description {
        color: hsl(180, 20%, 65%);
      }
      .btn-carregar {
        box-shadow: 0 0 10px hsla(120, 100%, 50%, 0.3);
      }
      .btn-eliminar {
        box-shadow: 0 0 10px hsla(0, 100%, 50%, 0.3);
      }
      .alert {
        padding: 1rem;
        border-radius: 0.5rem;
      }
      .alert-success {
        background-color: rgba(40, 167, 69, 0.2);
        border: 1px solid #28a745;
        color: #28a745;
      }
      .alert-danger {
        background-color: rgba(220, 53, 69, 0.2);
        border: 1px solid #dc3545;
        color: #dc3545;
      }
    `;
    this.shadowRoot.appendChild(styleExtra);

    // Afegir event listeners als botons
    this.afegirEventListeners();
  }

  getDireccioIcon(direccio) {
    const icons = {
      'dalt': '↑ Dalt',
      'baix': '↓ Baix',
      'esquerra': '← Esquerra',
      'dreta': '→ Dreta',
      'estatic': '◼ Estàtic'
    };
    return icons[direccio] || direccio;
  }

  afegirEventListeners() {
    // Botons carregar
    const btnsCarregar = this.shadowRoot.querySelectorAll(".btn-carregar");
    btnsCarregar.forEach(btn => {
      btn.addEventListener("click", () => {
        const partidaId = btn.getAttribute("data-id");
        const volum = btn.getAttribute("data-volum");
        this.carregarPartidaHandler(partidaId, volum);
      });
    });

    // Botons eliminar
    const btnsEliminar = this.shadowRoot.querySelectorAll(".btn-eliminar");
    btnsEliminar.forEach(btn => {
      btn.addEventListener("click", () => {
        const partidaId = btn.getAttribute("data-id");
        this.eliminarPartidaHandler(partidaId);
      });
    });
  }
}

customElements.define("app-partides-list", AppPartidesList);
