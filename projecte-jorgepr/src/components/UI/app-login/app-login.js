import { login } from "../../../services/backendapiservice";

class AppLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._formPerfil = "";
    this._inputFile = "";
    this._enviarBtn = "";
  }

  setElements() {
    this._formPerfil = this.shadowRoot.querySelector("#form-login");
    this._enviarBtn = this._formPerfil.querySelector("#enviarBtn");
  }

  connectedCallback() {
    this.render();
    this.setElements();

    this._enviarBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      this.netejarErrors();

      const form = new FormData(this._formPerfil);
      const objForm = Object.fromEntries(form);

      if (!this.validarFormulari(objForm)) return;

      try {
        const res = await this.actionLogin(objForm);

        console.log(res);
      } catch (e) {
        console.log("error peticio");

        this.errorAPI(e);
      }
    });
  }

  async actionLogin(form) {
    const objecteSessio = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };
    const resposta = await login(objecteSessio);
    return resposta;
  }

  mostrarError({ input, missatge }) {
    const inputError = this.shadowRoot.querySelector(`#${input}`);
    const spanError = this.shadowRoot.querySelector(`#error-${input}`);

    if (inputError) inputError.classList.add("input-error");
    if (spanError) {
      spanError.textContent = missatge;
      spanError.classList.remove("d-none");
    }
  }

  errorGeneral(missatge) {
    const errorDiv = this.shadowRoot.querySelector("#error-general");
    if (errorDiv) {
      errorDiv.textContent = missatge;
      errorDiv.classList.remove("d-none");
    }
  }

  netejarErrors() {
    // Netejar estil d'input error
    const inputs = this.shadowRoot.querySelectorAll("input");
    inputs.forEach((input) => input.classList.remove("input-error"));

    // Netejar spans d'error
    const errorSpans = this.shadowRoot.querySelectorAll(".error-message");
    errorSpans.forEach((span) => {
      span.textContent = "";
      span.classList.add("d-none");
    });

    // Netejar error general
    const errorGeneral = this.shadowRoot.querySelector("#error-general");
    if (errorGeneral) {
      errorGeneral.textContent = "";
      errorGeneral.classList.add("d-none");
    }
  }

  validarFormulari(form) {
    this.netejarErrors();
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      this.mostrarError({ input: "email", missatge: "Email invàlid" });
      valid = false;
    }

    if (!form.password || form.password.length < 6) {
      this.mostrarError({
        input: "password",
        missatge: "La contrasenya ha de tenir mínim 6 caràcters",
      });
      valid = false;
    }

    return valid;
  }

  errorAPI(error) {
    console.log("error d");
    console.log(error);

    //Aconsellat per la IA al corregir la pàgina, no gestionava els errors de Supabase
    if (error.msg?.includes("Invalid email")) {
      this.mostrarError("email", "Email invàlid");
    } else if (error.msg?.includes("Password")) {
      this.mostrarError("password", "Contrasenya massa dèbil");
    } else if (error.error_code.includes("invalid_credentials")) {
      this.errorGeneral("Credencials errònies.");
    } else {
      // Error genèric
      this.errorGeneral("Error al registrar-se. Torna-ho a intentar.");
    }
  }

  render() {
    const codi = `
  <div class="card bg-dark text-light border-secondary glow-effect cardClass p-4">
            <div class="card-header">
                <h3 class="card-title glow-text fw-bold">Benvingut de nou!</h3>
                <p class="card-description">Introdueix les teues credencials per a jugar</p>
                <div id="error-general" class="alert alert-danger d-none"></div>
            </div>
            <div class="card-content">
                <form id="form-login" class="d-flex flex-column gap-2" >
                    <div class="mb-2">
                        <label class="label" for="email">Email</label>
                        <input 
                            class="form-control bg-dark text-light border-secondary" 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="player@iogame.com"
                            required
                        />
                        <span class="error-message d-none" id="error-email"></span>
                    </div>
                    <div class="form-group mb-4">
                        <label class="label" for="password">Password</label>
                        <input 
                            class="form-control bg-dark text-light border-secondary" 
                            id="password" 
                            type="password" 
                            name="password"  
                            placeholder="••••••••"
                            required
                        />
                    <span class="error-message d-none" id="error-password"></span>
                    </div>
                    <button id="enviarBtn" class="button btn btn-primary w-100 fw-bold">Login</button>
                    <p class="text-center">
                        Don't have an account? 
                        <a href="#register" class="badge badge-dark linked">Registra't ací</a>
                    </p>
                </form>
            </div>
        </div>
  `;
    //Tot el shadowRoot perquè ja és un element html que es pot fer append
    this.shadowRoot.innerHTML = codi;
    return this;
  }
}

customElements.define("app-login", AppLogin);
