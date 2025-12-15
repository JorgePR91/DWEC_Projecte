import {
  singIN,
  getProfile,
  actualitzar,
  getImage,
} from "../../../services/backendapiservice";
import styles from "../../../style.scss?inline";

class AppProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._titol = "";
    this._subtitol = "";
    this._formPerfil = "";
    this._formImg = "";
    this._canvas = "";
    this._inputFile = "";
    this._enviarBtn = "";
  }

  setElements() {
    this._formPerfil = this.shadowRoot.querySelector("#profile_register");
    this._formImg = this.shadowRoot.querySelector("#imgForm");
    this._canvas = this.shadowRoot.querySelector("#imgCanva");
    this._inputFile = this._formImg.querySelector('input[type="file"]');
    this._enviarBtn = this._formPerfil.querySelector("#enviarBtn");
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

  if (form.password || form.confirmPassword) {
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
// Mètode de registre/actualització
async accioRegistre(form) {
  const user_id = localStorage.getItem("user_id");
  
  // Si NO hay sesión, es un registro nuevo
  if (!user_id) {
    const objecteSessio = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    const resposta = await singIN(objecteSessio);

    if (resposta.user) {
      const dadesUsuari = {
        username: form.username,
        avatar: form.avatar,
      };

      const modificat = await actualitzar({
        id: resposta.user.id,
        dadesUsuari,
      });
    } else {
      throw new Error("Error amb el registre");
    }
  } else {
    // Si YA hay sesión, solo actualizar el perfil (sin hacer login)
    const dadesUsuari = {
      username: form.username,
    };
    
    // Solo añadir avatar si existe
    if (form.avatar) {
      dadesUsuari.avatar = form.avatar;
    }

    const modificat = await actualitzar({
      id: user_id,
      dadesUsuari,
    });
    console.log("Perfil actualitzat:", modificat);
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
      const profile = await getProfile({id: user_id, token: token});

      this._formPerfil.querySelector("#username").value = profile.username;
      this._formPerfil.querySelector("#email").value = localStorage.getItem('user_email');

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
    const titol = this.getAttribute("titol") || "";
    const subtitol = this.getAttribute("subtitol") || "";

    this.shadowRoot.innerHTML = "";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
    this.shadowRoot.appendChild(link);

    const esRegistre = (titol === "Uneix-te al joc");
    const esPerfil = (titol === "Perfil");

    const codi = `
    <div class="card bg-dark text-light border-secondary glow-effect p-4">
            <div class="card-header">
                <h3 class="card-title glow-text fw-bold">${titol}</h3>
                <p class="card-description">${subtitol}</p>
            </div>
            ${
              esPerfil
                ? `
              <div class="card-content mb-3">
                <a href="#partides" class="verd-button btn w-100">
                  Gestionar les meues partides
                </a>
              </div>
            `
                : ""
            }
            <div class="card-content d-flex gap-3">
                <form id="profile_register" class="col-6 form d-flex flex-column gap-3" >
        
                    <div class="form-group ">
                        <label class="label" for="username">Username</label>
                        <input 
                            class="input form-control bg-dark text-light border-secondary" 
                            id="username" 
                            name="username"
                            type="text" 
                            placeholder="PlayerOne"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="email">Email</label>
                        <input 
                            class="input form-control bg-dark text-light border-secondary" 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="player@iogame.com"
                            required
                        />
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
                        <span class="error" id="error-message" style="display: none;"></span>
                    </div>
                    ${
                      esRegistre
                        ? `
                      <button id="enviarBtn" type="submit" class="button btn btn-primary w-100 fw-bold">Registre</button>
                    <p class="text-center">
                        Ja tens un compte? 
                        <a href="#login" class="badge badge-dark linked">Inicia sessió</a>
                    </p>
                  `
                        : '<button id="enviarBtn" type="submit" class="button btn btn-primary w-100 fw-bold">Actualitza</button>'
                    }
                </form>
                <form id="imgForm">
                <div class="d-flex flex-column align-items-center">
                <canvas id="imgCanva" class="border border-2 border-primary rounded-circle m-4"></canvas>
                </div>
                <input type="file" class="input w-100">
                </form>
            </div>
        </div>
    `;
    const template = document.createElement("template");
    template.innerHTML = codi;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //Tot el shadowRoot perquè ja és un element html que es pot fer append
    // this.shadowRoot.innerHTML = codi;

    const styleSheets = new CSSStyleSheet();
    styleSheets.replaceSync(styles);
    this.shadowRoot.adoptedStyleSheets = [styleSheets];
  }
}

customElements.define("app-profile", AppProfile);
