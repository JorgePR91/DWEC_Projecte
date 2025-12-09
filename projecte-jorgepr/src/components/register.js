export { renderRegister };
//import { APIKEY_anon_public, singUpUrl } from "../enviroment";
import { singIN, updateUser, getProfile } from "../services/backendapiservice";

async function renderRegister() {
  const codi = `
    <div class="card bg-dark text-light border-secondary glow-effect p-4">
            <div class="card-header">
                <h3 class="card-title glow-text fw-bold">Uneix-te al joc</h3>
                <p class="card-description">Crea't uncompte per a començar a jugar</p>
            </div>
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
                    <button id="enviarBtn" type="submit" class="button btn btn-primary w-100 fw-bold">Register</button>
                    <p class="text-center">
                        Ja tens un compte? 
                        <a href="#login" class="badge badge-dark linked">Inicia sessió</a>
                    </p>
                </form>
                <form id="imgForm">
                <div class="col-6 d-flex flex-column align-items-center">
                <canva id="imgCanva" class="border border-2 border-primary rounded-circle m-4"></canva>
                <input type="file" class="input w-50">
                </div>
                </form>
            </div>
        </div>
    `;
  const section = document.createElement("section");
  section.innerHTML = codi;

  const btn = section.querySelector("#enviarBtn");

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(section.getElementsByTagName("form")[0]);

    if (form.password === form.confirmPassword) {
      const objForm = Object.fromEntries(form);

      console.log("desde");
      console.log(form);
      console.log("enviar");
      console.log(objForm);

      accioRegistre(objForm);
    }
  });

  if (localStorage.getItem("expires_in") > 0) {
    const profile = getProfile(
      localStorage.getItem("user_id"),
      localStorage.getItem("access_token")
    );
    redimensioPutImg(section.querySelector("#imgCanva"), profile.avatar_blob);
  }

  return section;
}

// Mètode per a redimensionar la imatge clavant-a en el canvas

// Mètode de registre/actualització
const accioRegistre = async (form) => {
  const objecteSessio = {
    email: form.email.trim().toLowerCase(),
    password: form.password,
  };

  const resposta = await singIN(objecteSessio);
  console.log("Acció Registre resposta:");

  console.log(resposta);

  if (resposta.user) {
    const modificat = await updateUser(
      resposta.user.id,
      resposta.access_token,
      {
        username: form.username,
      }
    );
    console.log("Resposta:");
    console.log(modificat);
  } else {
    const error = "Error amb el registre";
    console.log(error);
  }
};
const carregarImatge = (imgFile) => {
  //Agafem el canvas i el context, com en el jdlv
  const canvas = this.shadowRoot.getElementById("imgCanva");
  const ctx = canvas.getContext("2d");
  //El netegem
  ctx.clearRect(0, 0, canvas.height, canvas.width);

  //Definim la grandària perquè en el css soles es defineis la visual
  canvas.width = 100;
  canvas.height = 100;
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
};
const exportarImatge = (img) => {
  //const avatar = await this.obtenerAvatarParaEnviar();
  //this.obtenerAvatarParaEnviar().then(avatar => {
  //     console.log(avatar);
  // });
  const canvas = this.shadowRoot.getElementById("imgCanva");
  //mètode asíncrone per a convertir el contingut del canvas a blob
  return new Promise(resolve => {
    canvas.toBlob(
      blob => {
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
};
