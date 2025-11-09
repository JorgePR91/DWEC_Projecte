export { renderRegister };
//import { APIKEY_anon_public, singUpUrl } from "../enviroment";
import { singIN, updateUser, getProfile } from "../services/backendapiservice";

async function renderRegister() {
  const codi1 = `
    <div class="card glow-effect">
            <div class="card-header">
                <h3 class="card-title glow-text">Uneix-te al joc</h3>
                <p class="card-description">Crea't uncompte per a començar a jugar</p>
            </div>
            <div class="card-content">
                <form class="form" onsubmit="return handleSubmit(event)">
                    <div class="form-group">
                        <label class="label" for="username">Username</label>
                        <input 
                            class="input" 
                            id="username" 
                            type="text" 
                            placeholder="PlayerOne"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="email">Email</label>
                        <input 
                            class="input" 
                            id="email" 
                            type="email" 
                            placeholder="player@iogame.com"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="password">Password</label>
                        <input 
                            class="input" 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="confirmPassword">Confirm Password</label>
                        <input 
                            class="input" 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="••••••••"
                            required
                        />
                        <span class="error" id="error-message" style="display: none;"></span>
                    </div>
                    <button type="submit" class="button">Register</button>
                    <p class="text-center">
                        Already have an account? 
                        <a href="/login" class="link">Login here</a>
                    </p>
                </form>
            </div>
        </div>`;

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



  if(localStorage.getItem("expires_in") > 0){
 const profile = getProfile(localStorage.getItem("user_id"), localStorage.getItem("access_token"));
 redimensioPutImg(section.querySelector("#imgCanva"), profile.avatar_blob);
   
  } 


  return section;
}

// Mètode per a redimensionar la imatge clavant-a en el canvas
const redimensioPutImg = (canvas, imatge) => {

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.height,canvas.width);
    const proporcio = Math.min(canvas.width / imatge.width, canvas.height / imatge.height);
    const ample = imatge.width*proporcio;
    const alt = imatge.height*proporcio;
    const posX = (canvas.width-ample)/2;
    const posY = (canvas.height-alt)/2;
    ctx.drawImage(imatge, posX, posY, ample, alt);
    
    return canvas;
}

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

  //   let response = await fetch(singUpUrl, {
  //     method: "post",
  //     headers: {
  //       apiKey: APIKEY_anon_public,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(objecteSessio),
  //   });

  //   let data = await response.json();
};
