

class AppCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._disabled = false;
    this._title = '';
    this._subtitle = '';
  }



  connectedCallback() {
    this.render();
  }


  render() {
    const codi = `
     <div class="card bg-dark text-light border-secondary glow-effect p-4">
      <div class="card-header">
        <h3 class="card-title glow-text fw-bold">${this._title}</h3>
        <p class="card-description">${this._subtitle}</p>
        <div id="error-general" class="alert alert-danger d-none"></div>
      </div>
      <div class="card-content d-flex gap-3">
        <form id="profile_register" class="col-6 form d-flex flex-column gap-3">
          <div class="form-group">
            <label class="label" for="username">Username</label>
            <input
              class="input form-control bg-dark text-light border-secondary"
              id="username"
              name="username"
              type="text"
              placeholder=""
              required
            />
            <span class="error-message d-none" id="error-username"></span>
          </div>
          <div class="form-group">
            <label class="label" for="email">Email</label>
            <input
              class="input form-control bg-dark text-light border-secondary"
              id="email"
              name="email"
              type="email"
              placeholder=""
              required
            />
            <span class="error-message d-none" id="error-email"></span>
          </div>
          <div class="form-group">
            <label class="label" for="password">Password</label>
            <input
              class="input form-control bg-dark text-light border-secondary"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            <span class="error-message d-none" id="error-password"></span>
          </div>
          <div class="form-group">
            <label class="label" for="confirmPassword">Confirm Password</label>
            <input
              class="input form-control bg-dark text-light border-secondary"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
            <span
              class="error-message d-none"
              id="error-confirmPassword"
            ></span>
          </div>
          <button
            id="enviarBtn"
            type="submit"
            class="button btn btn-primary w-100 fw-bold"
          >
            Register
          </button>
          <p class="text-center">
            Ja tens un compte?
            <a href="#login" class="badge badge-dark linked">Inicia sessió</a>
          </p>
        </form>
        <form id="imgForm">
          <div class="col-6 d-flex flex-column align-items-center">
            <canvas
              id="imgCanva"
              class="border border-2 border-primary rounded-circle m-4"
            ></canvas>
            <input type="file" class="input w-50" />
          </div>
        </form>
      </div>
    </div>
    `;
    //Tot el shadowRoot perquè ja és un element html que es pot fer append
    this.shadowRoot.innerHTML = codi;
    return this;
  }
}

customElements.define("app-card", AppCard);
