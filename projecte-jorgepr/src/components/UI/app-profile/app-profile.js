import {
  singIN,
  getProfile,
  actualitzar,
  getImage,
} from "../../../services/backendapiservice";

class AppProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._formPerfil = "";
    this._formImg = "";
    this._canvas = "";
    this._inputFile = "";
    this._enviarBtn = "";

    this.afegirEstils();
  }

  setElements() {
    this._formPerfil = this.shadowRoot.querySelector("#profile_register");
    this._formImg = this.shadowRoot.querySelector("#imgForm");
    this._canvas = this.shadowRoot.querySelector("#imgCanva");
    this._inputFile = this._formImg.querySelector('input[type="file"]');
    this._enviarBtn = this._formPerfil.querySelector("#enviarBtn");
  }

  afegirEstils() {
    const style = document.createElement("style");
    style.textContent = `
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.d-none {
  display: none !important;
}

.input-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  color: #dc3545;
}
  /* Bordes */
.border-secondary {
  border-color: #6c757d;
}

.border {
  border: 1px solid #dee2e6;
}

.border-primary {
  border-color: #007bff;
}

.rounded-circle {
  border-radius: 50%;
}

/* Botones */
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

/* Dimensiones */
.w-100 {
  width: 100%;
}

.w-50 {
  width: 50%;
}

/* Espaciado */
.p-4 {
  padding: 1.5rem;
}

.m-4 {
  margin: 1.5rem;
}

/* Fondos */
.bg-dark {
  background-color: #343a40;
}

/* Layout & Flex */
.d-none {
  display: none;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.align-items-center {
  align-items: center;
}

/* Texto */
.text-light {
  color: #f8f9fa;
}

.text-center {
  text-align: center;
}

---------------------------------------
#app {
  backdrop-filter: blur(12px);
  position: sticky;
  border-bottom: 1px solid hsl(240, 10%, 20%);
  background: hsla(240, 10%, 12%, 0.5);
}

header {
  backdrop-filter: blur(12px);
}

.logo {
  color: hsl(180, 100%, 95%);
}

.nav-button {
  background: transparent;
  color: hsl(180, 100%, 95%);
  transition: all 0.2s;
}

.nav-button:hover {
  background: hsl(240, 10%, 20%);
}

.username {
  color: hsl(180, 100%, 95%);
}

.avatar {
  width: 25px;
  border: 1px solid hsla(180, 100%, 50%, 0.5);
  background: hsla(180, 100%, 50%, 0.2);
  color: hsl(180, 100%, 50%);
}

#imgCanva {
  //aspect-ratio: 1/1;
  width: 100px;
  height: 100px;
}

main {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  //padding: 1rem;

  /*PROVAR A FER PER MÍ*/
}

.cardClass {
  border-radius: 0.75rem;
  border: 1px solid hsl(240, 10%, 20%);
  background: hsl(240, 10%, 12%);
  color: hsl(180, 100%, 95%);
  //box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  color: hsl(180, 100%, 95%);
}

input::placeholder {
  color: hsl(180, 20%, 65%);
}

input:focus {
  border-color: hsl(180, 100%, 50%);
  box-shadow: 0 0 0 2px hsla(180, 100%, 50%, 0.2);
}

button {
  box-shadow: 0 0 20px hsla(180, 100%, 50%, 0.4);
  background: linear-gradient(135deg, hsl(180, 100%, 50%), hsl(160, 100%, 45%));
}

.linked {
  text-decoration: none;
}

.linked:hover {
  text-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5),
    0 0 20px hsla(180, 100%, 50%, 0.3);
  text-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5),
    0 0 20px hsla(180, 100%, 50%, 0.3);
  color: hsl(180, 100%, 50%);

}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px hsla(180, 100%, 50%, 0.6);
}

.button:active {
  transform: translateY(0);
}

.text-center {
  /* .text-center.text-muted */
  color: hsl(180, 20%, 65%);
}

.link {
  color: hsl(180, 100%, 50%);
}

.link:hover {
  text-decoration: underline;
}

.error {
  /* .text-danger.small */
  color: hsl(0, 85%, 60%);

}

footer p {
  font-size: 0.875rem;
  color: hsl(180, 20%, 65%);
}

.board {
  width: fit-content;
  max-height: 80vh;
  margin: auto;
  padding: 10px;
  max-width: 100vw;
  max-height: 100vh;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  background: #444;
}

.celda {
  padding: 0;
  margin: 0;
  min-width: 20px;
  aspect-ratio: 1;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 0.2em;
  color: #222;
  //background: linear-gradient(180deg, #f8f8f8, #e9eef8);
  /*background: url('/src/imgs/fruites.png') no-repeat;
    background-size: 350px ;
    background-position: -90px -20px;*/
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}

.poma {
  background-color: red;
}

.serp {
  background-color: darkolivegreen;
}

//--Efectes
.glow-effect {
  box-shadow: 0 0 20px hsla(180, 100%, 50%, 0.3),
    0 0 40px hsla(180, 100%, 50%, 0.1);
}

.glow-text {
  text-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5),
    0 0 20px hsla(180, 100%, 50%, 0.3);
}
    `;

    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.render();
    this.setElements();

    this.getSession() && this.carregarPerfil();

    this._inputFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      file && this.validarImatge(file) && this.carregarImatge(file);
    });

    this._enviarBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      this.netejarErrors();
      const form = new FormData(this._formPerfil);
      const objForm = Object.fromEntries(form);

      if (!this.validarFormulari(objForm)) return;

      try {
        const imatgePujar = await this.exportarImatge();
        objForm.avatar = imatgePujar;
        await this.accioRegistre(objForm);
      } catch (e) {
        this.errorAPI(e);
      }
    });
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

  validarImatge(file) {
    //També de la IA
    // Mida màxima: 2MB
    if (file.size > 2 * 1024 * 1024) {
      this.errorGeneral("La imatge no pot superar 2MB");
      return false;
    }

    // Formats vàlids
    const formatsValids = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!formatsValids.includes(file.type)) {
      this.errorGeneral("Format d'imatge no vàlid (usa JPG, PNG o WEBP)");
      return false;
    }

    return true;
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

    if (!form.username || form.username.trim().length < 3) {
      this.mostrarError({
        input: "username",
        missatge: "El username ha de tenir mínim 3 caràcters",
      });
      valid = false;
    }

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

    if (form.password !== form.confirmPassword) {
      this.mostrarError({
        input: "password",
        missatge: "Les contrasenyes no coincideixen",
      });
      valid = false;
    }

    return valid;
  }

  errorAPI(error) {
    //Aconsellat per la IA al corregir la pàgina, no gestionava els errors de Supabase
    if (error.message?.includes("already registered")) {
      this.mostrarError("email", "Aquest email ja està registrat");
    } else if (error.message?.includes("Invalid email")) {
      this.mostrarError("email", "Email invàlid");
    } else if (error.message?.includes("Password")) {
      this.mostrarError("password", "Contrasenya massa dèbil");
    } else {
      // Error genèric
      this.errorGeneral("Error al registrar-se. Torna-ho a intentar.");
    }
  }

  carregarImatge(imgFile) {
    //Agafem el canvas i el context, com en el jdlv
    // const canvas = this.shadowRoot.getElementById("imgCanva");
    const ctx = this._canvas.getContext("2d");
    //El netegem
    ctx.clearRect(0, 0, this._canvas.height, this._canvas.width);

    //Definim la grandària perquè en el css soles es defineis la visual
    this._canvas.width = 100;
    this._canvas.height = 100;
    //PReparem l'objecte que llegirà el document de la imatge
    const reader = new FileReader();
    //Clavem una funció per a que quan es carregue el fitxer faça un objecte imatge preparat per a ser dibuixat
    reader.onload = (e) => {
      const img = new Image();
      //quan la imatge estiga carregada (buida encara) la dibuixem al canvas amb les dimensions i posicions
      img.onload = () => {
        //Proporcionem quadrada(IA)
        const minSize = Math.min(img.width, img.height);
        const startX = (img.width - minSize) / 2;
        const startY = (img.height - minSize) / 2;

        // Dibuixem al canvas
        ctx.drawImage(img, startX, startY, minSize, minSize, 0, 0, 100, 100);
      };
      //Ara bé l'acció, agafem el target de l'esdeveniment de càrrega de fitxer, que té la imatge en Data URL, i li la clavem al objecte imatge, el qual comença a fer els passos per a redimensionar-la i clavar-la al canvas.
      img.src = e.target.result;
    };
    //I ara comença a llegir el fitxer. Es fa tot al revés, primer ho preparem tot i després ho apliquem, i això és perquè són accions pesades que poden ralentitzar el procediment, per tant, sols actuem quan tot està preparat (ja que és tot asíncrone)
    reader.readAsDataURL(imgFile);
  }

  // Mètode de registre/actualització
  async accioRegistre(form) {
    const objecteSessio = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    const resposta = await singIN(objecteSessio);
    console.log("Acció Registre resposta:");
    console.log(resposta);

    if (resposta.user) {
      const dadesUsuari = {
        username: form.username,
        avatar: form.avatar,
      };

      const modificat = await actualitzar({
        id: resposta.user.id,
        dadesUsuari,
      });
      console.log("Resposta:");
      console.log(modificat);
    } else {
      const error = "Error amb el registre";
      console.log(error);
    }
  }

  exportarImatge() {
    //const avatar = await this.obtenerAvatarParaEnviar();
    //this.obtenerAvatarParaEnviar().then(avatar => {
    //     console.log(avatar);
    // });
    //mètode asíncrone per a convertir el contingut del canvas a blob
    return new Promise((resolve) => {
      this._canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }

  async carregarPerfil() {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    if (user_id && token) {
      const profile = await getProfile(user_id, token);

      this._formPerfil.querySelector("#username").value = profile.username;
      this._formPerfil.querySelector("#email").value = profile.email;

      if (profile.avatar_url) {
        const imgSrc = await getImage(profile.avatar_url);
        this.mostrarImatge(imgSrc);
      }
    }
  }

  mostrarImatge(urlBlob) {
    const ctx = this._canvas.getContext("2d");
    ctx.clearRect(0, 0, this._canvas.height, this._canvas.width);

    this._canvas.width = 100;
    this._canvas.height = 100;

    const img = new Image();

    img.onload = () => {
      const minSize = Math.min(img.width, img.height);
      const startX = (img.width - minSize) / 2;
      const startY = (img.height - minSize) / 2;

      ctx.drawImage(img, startX, startY, minSize, minSize, 0, 0, 100, 100);
    };
    img.src = urlBlob;
  }

  getSession() {
    return localStorage.getItem("user_id");
  }

  render() {
    const codi = `
     <div class="card bg-dark text-light border-secondary glow-effect p-4">
      <div class="card-header">
        <h3 class="card-title glow-text fw-bold">Uneix-te al joc</h3>
        <p class="card-description">Crea't uncompte per a començar a jugar</p>
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

customElements.define("app-profile", AppProfile);
