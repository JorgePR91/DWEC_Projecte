// import * as bootstrap from "bootstrap";
// import "./styles.scss";
// import styles from "./styles.scss?inline";
import { logout } from "../../../services/backendapiservice";
import { getUsernameUsuari, $getAvatarUsuari } from "../../../services/userSessionService";

class AppHeaderNav extends HTMLElement {
  constructor() {
    super();

    this._actiu = null;
    this._disabled = false;
    this._enllaços = [];
    this._titol = "";
    this._userNom = "";
    this._usuariSubscription = null;
    this._avatarSubsciption = null;
  }

  connectedCallback() {
    const auxiliarEnllaços = this.getAttribute("enllaços") || "";

    this._enllaços = auxiliarEnllaços.split(",").map((e) => {
      let paraula = e.trim();
      return paraula[0].toUpperCase() + paraula.substring(1).toLowerCase();
    });
    this._titol = this.getAttribute("titol") || "";
    this._usuari = localStorage.getItem("user");

    this.render();
    this.suscripcioNom();
    this.suscripcioAvatar();

    this._usuari && this.sessioIniciada();
  }
  sessioIniciada() {
    this.mostrarBtnLogout();
  }
  mostrarBtnLogout() {
    const aux = this.querySelector("#tancar-sessio");
    if (aux) return;

    const btn = document.createElement("button");
    btn.setAttribute("id", "tancar-sessio");
    btn.classList.add("logout-btn");
    btn.textContent = "Tancar sessió";

    this.querySelector("div.right").appendChild(btn);
    // .filter((d) => d.clasList.includes("right"))

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
  actualitzarUserNom(valor) {
    this.querySelector("#user").textContent = valor;
  }
  disconnectedCallback() {
    if (this._usuariSubscription) {
      this._usuariSubscription.unsubscribe();
    }
    if (this._avatarSubsciption) {
      this._avatarSubsciption.unsubscribe();
    }
  }
  eliminarBotoTancarSessio() {
    const btn = this.querySelector("#tancar-sessio");
    if (btn) {
      btn.remove();
    }
  }
  suscripcioNom() {
    this._usuariSubscription = getUsernameUsuari().subscribe((u) => {
      this._userNom = u;
      if (u) {
        this.actualitzarUserNom(u);
        this.mostrarBtnLogout();
      } else {
        this.actualitzarUserNom("");
        this.eliminarBotoTancarSessio();
      }
    });
  }
  suscripcioAvatar() {
    this._avatarSubsciption = $getAvatarUsuari().subscribe((url) => {
    const imgElement = this.querySelector("#userImg img");
      if (imgElement) {
        if(url){
          imgElement.setAttribute('src', url)
        } else {
          imgElement.setAttribute('src', "/public/Smiley-Emoticon.png")
        }
    }});
  }

  render() {
    this.innerHTML = `
            <style>
        :host {
  backdrop-filter: blur(12px);
}
nav {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

div.left {
  display: flex;
  align-items: center;
  gap: 2;
}
div.right {
  display: flex;
  align-items: center;
  gap: 0.75;
}
.divEnllaç{
  display: flex;
  gap: 2;
  margin-left: 1rem;
}
a.enllaç {
  display: inline-block;
  cursor: pointer;
  border: none;
  text-decoration: none;
  color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: transparent;
  color: hsl(180, 100%, 95%);
  transition: all 0.2s;
}
.enllaç:hover {
  text-shadow:
    0 0 5px hsla(180, 100%, 50%, 0.5),
    0 0 10px hsla(180, 100%, 50%, 0.3);
}
a.titol {
  font-weight: 700;
  color: hsl(180, 100%, 95%);
  font-size: 1.5rem;
  text-decoration: none;
}
.glow-effect {
  box-shadow:
    0 0 20px hsla(180, 100%, 50%, 0.3),
    0 0 40px hsla(180, 100%, 50%, 0.1);
}
.glow-text {
  text-shadow:
    0 0 10px hsla(180, 100%, 50%, 0.5),
    0 0 20px hsla(180, 100%, 50%, 0.3);
}
.username {
  color: hsl(180, 100%, 95%);
  font-weight: 700;
  margin: 0.5rem;
  text-decoration: none;
  font-size: 1.5rem;
}
.avatar {
  width: fit-content;
  border: 1px solid hsla(180, 100%, 50%, 0.5);
  background: hsla(180, 100%, 50%, 0.2);
  color: hsl(180, 100%, 50%);
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 50%;
}
img {
  display: grid;
  align-items: center;
  justify-items: center;
  width: 2rem;
  border-radius: 50%;
}
.logout-btn {
  cursor: pointer;
  border: 1px solid hsla(180, 100%, 50%, 0.5);
  background: hsla(180, 100%, 50%, 0.2);
  color: hsl(180, 100%, 95%);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  transition: all 0.2s;
  margin-left: 1rem;
}
.logout-btn:hover {
  background: hsla(180, 100%, 50%, 0.3);
  box-shadow: 0 0 10px hsla(180, 100%, 50%, 0.5);
}
        </style>
        <nav>
          <div class="left">
            <a href="#" class="titol glow-text">${this._titol}</a>
            <div class="divEnllaç">
        ${this._enllaços
          .map(
            (e, i) =>
              `<a href="#${e.toLowerCase()}" class="enllaç ${(i === this._actiu && "glow-effect") || ""}">${e}</a>`
          )
          .join("")}
            </div>
          </div>
          <div class="right">
            <a href="#profile" id="user" class="username glow-text"></a>
            <div id="userImg" class="avatar glow-effect">
            <img src="/public/Smiley-Emoticon.png">
            </div>
          </div>
        </nav>
`;
  }
}

customElements.define("app-header-nav", AppHeaderNav);

/*He decidit fer un component únic per al nav per les següents raons:
  1. Els seus components no són intercanviables com si foren targetes i si ho són, la seua simplicitat ho desaconsella.
  2. El seu disseny em feia més dificultós generar dos div-component (1 amb títol i enllaços i altre amb foto i perfil), que juntar-ho tot dins d'un.
  */