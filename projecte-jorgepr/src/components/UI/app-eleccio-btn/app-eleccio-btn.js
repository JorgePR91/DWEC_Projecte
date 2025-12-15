class AppEleccioBtn extends HTMLElement {
  static get observedAttributes() {
    return ["titol", "subtitol"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._sizes = {
      xs: { volum: 8, label: "XS - Extra xicotet", description: "10x10" },
      s: { volum: 10, label: "S - Xicotet", description: "12x12" },
      m: { volum: 15, label: "M - Mitjà", description: "15x15" },
      l: { volum: 20, label: "L - Gran", description: "20x20" },
      xl: { volum: 25, label: "XL - Extra Gran", description: "25x25" },
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.shadowRoot.innerHTML) {
      this.updateContent(name, newValue);
    }
  }

  updateContent(name, value) {
    if (name === "titol") {
      const titleElement = this.shadowRoot.querySelector(".card-title");
      if (titleElement) titleElement.textContent = value;
    } else if (name === "subtitol") {
      const subtitleElement = this.shadowRoot.querySelector(".card-description");
      if (subtitleElement) subtitleElement.textContent = value;
    }
  }

  render() {
    const titol = this.getAttribute("titol") || "Tria la mida del tauler";
    const subtitol =
    this.getAttribute("subtitol") ||
      "Selecciona la dificultat del joc segons la mida";

   const codi = `
      <style>
        .carta {
          background-color: #1a1a1a;
          color: #f8f9fa;
          border: solid 2px #333;
          padding: 2rem;
          border-radius: 10px;
          max-width: 600px;
          margin: 2rem auto;
        }

        .card-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .card-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5),
                       0 0 20px hsla(180, 100%, 50%, 0.3);
        }

        .card-description {
          color: #adb5bd;
          font-size: 1rem;
        }

        .size-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .size-grid :nth-child(3){
          grid-column: 1/3;
        }

        .size-button {
  border: 1px solid hsla(180, 100%, 50%, 0.5);
  background: hsla(180, 100%, 50%, 0.2);
  color: hsl(180, 100%, 95%);
  box-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5);
          border-radius: 8px;
          padding: 1.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .size-button:hover {
  background: hsla(180, 100%, 50%, 0.3);
  box-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5);
            border-color: #5fc3e4;
          transform: translateY(-2px);
        }

        .size-button:active {
          transform: translateY(0);
        }

        .size-label {
          display: block;
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .size-description {
          display: block;
          font-size: 0.875rem;
          color: #adb5bd;
        }

        .glow-effect {
          box-shadow: 0 0 20px hsla(180, 100%, 50%, 0.3),
                      0 0 40px hsla(180, 100%, 50%, 0.1);
        }

        @media (max-width: 768px) {
          .carta {
            padding: 1.5rem;
            margin: 1rem;
          }

          .size-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.75rem;
          }

          .size-button {
            padding: 1rem 0.5rem;
          }

          .card-title {
            font-size: 1.5rem;
          }
        }
      </style>

      <div class="carta glow-effect">
        <div class="card-header">
          <h3 class="card-title">${titol}</h3>
          <p class="card-description">${subtitol}</p>
        </div>

        <div class="size-grid">
          ${Object.entries(this._sizes)
            .map(
              ([key, size]) => `
            <button class="size-button" data-size="${key}" data-volum="${size.volum}">
              <span class="size-label">${size.label}</span>
              <span class="size-description">${size.description}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    this.shadowRoot.innerHTML = codi;

  }

  setupEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll(".size-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const size = button.dataset.size;
    const volum = parseInt(button.dataset.volum);

    this.dispatchEvent(
      new CustomEvent("size-selected", {
        detail: { size, volum },
        bubbles: true,
        composed: true,
      })
    );

    window.location.hash = `#game?volum=${volum}`;
  });
    });
  }

  removeEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll(".size-button");
    buttons.forEach((button) => {
      button.removeEventListener("click", this.handleSizeSelection.bind(this));
    });
  }

  
}

customElements.define("app-eleccio-btn", AppEleccioBtn);
