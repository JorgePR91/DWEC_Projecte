import { login } from "../../../services/backendapiservice";
import styles from "../../../style.scss?inline";

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
    this._inputFile = this._formPerfil.querySelector("#inputFile");
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

        // Redirigir a la página principal tras login exitoso
        window.location.hash = "#game";
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

  /*errorAPI(error) {

    //Aconsellat per la IA al corregir la pàgina, no gestionava els errors de Supabase
    if (error.message?.includes("Invalid email")) {
      this.mostrarError("email", "Email invàlid");
    } else if (error.message?.includes("Password")) {
      this.mostrarError("password", "Contrasenya massa dèbil");
    } else if (error.error_code.includes("invalid_credentials")) {
      this.errorGeneral("Credencials errònies.");
    } else {
      // Error genèric
      this.errorGeneral("Error al registrar-se. Torna-ho a intentar.");
    }
  }*/

      errorAPI(error) {
    console.log(`Export API ${error}`);
    console.log(error);
    
    //De vegades enviem error com a missatge, de vegades enviem error com a objecte error.
    const errorMessage = error.message || error;
    
    if (errorMessage.includes("Login invalido") || errorMessage.includes("UNAUTHORIZED")) {
      this.errorGeneral("Credencials errònies.");
    } else {
      this.errorGeneral("Error al iniciar sessió. Torna-ho a intentar.");
    }
  }


  render() {
    this.shadowRoot.innerHTML = "";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    this.shadowRoot.appendChild(link);

    const codi = `
  <div class="card bg-dark text-light border-secondary glow-effect cardClass p-4">
            <div class="card-header">
                <h3 class="card-title glow-text fw-bold">Benvingut de nou!</h3>
                <p class="card-description">Introdueix les teues credencials per a jugar</p>
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
                    </div>
                    <button type="submit" id="enviarBtn" class="button btn btn-primary w-100 fw-bold">Login</button>
                    <p class="text-center">
                        Don't have an account? 
                        <a href="#register" class="badge badge-dark linked">Registra't ací</a>
                    </p>
                </form>
            </div>
        </div>
  `;
    const template = document.createElement("template");
    template.innerHTML = codi;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const styleSheets = new CSSStyleSheet();
    styleSheets.replaceSync(styles);
    this.shadowRoot.adoptedStyleSheets = [styleSheets];
  }
}

customElements.define("app-login", AppLogin);
