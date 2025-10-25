export { renderLogin };
import { APIKEY_anon_public, loginUrl } from "./enviroment";

function renderLogin() {
  //https://mdbootstrap.com/docs/standard/extended/login/
  const codi1 = `
                <section class="vh-100" style="background-color: #4f4f4fff">
        <div class="container py-5">
          <div
            class="row d-flex justify-content-center align-items-center h-100"
          >
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="card shadow-2-strong" style="border-radius: 1rem">
                <div class="card-head p-5">
                  <h1 class="mb-5">Login</h1>
                </div>
                <form class="card-body p-5 text-center">
                  <div class="form-outline mb-4">
                    <label class="form-label" for="usuari">Correu</label>
                    <input
                      type="email"
                      id="usuari"
                      class="form-control form-control-lg"
                    />
                  </div>

                  <div class="form-outline mb-4">
                                      <label class="form-label" for="pwd"
                      >Password</label
                    >
                    <input
                      type="password"
                      id="pwd"
                      class="form-control form-control-lg"
                    />
                  </div>

<!-- Checkbox 
  <div class="form-check d-flex justify-content-start mb-4">
    <input
               class="form-check-input"
                      type="checkbox"
                      value=""
                      id="form1Example3"
                    />
                    <label class="form-check-label" for="form1Example3">
                      Remember password
                    </label>
                  </div>
-->
                  <button
                    class="btn btn-primary btn-lg btn-block"
                    type="submit"
                    id="enviarBtn"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  const codi = `
  <div class="card bg-dark text-light border-secondary glow-effect cardClass p-4">
            <div class="card-header">
                <h3 class="card-title glow-text">Benvingut de nou!</h3>
                <p class="card-description">Introdueix les teues credencials per a jugar</p>
            </div>
            <div class="card-content">
                <form class="d-flex flex-column gap-2" >
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
                    <button type="submit" id="enviarBtn" class="button btn btn-primary w-100">Login</button>
                    <p class="text-center text-muted">
                        Don't have an account? 
                        <a href="#register" class="link link-primary">Register here</a>
                    </p>
                </form>
            </div>
        </div>
  `;

  const section = document.createElement("section");
  //section.classList.add('container');
  section.innerHTML = codi;

   const btn = section.querySelector("#enviarBtn");
   const form = section.getElementsByTagName("form")[0];

   btn.addEventListener("click", (event) => {
     event.preventDefault();
     console.log("enviar");
     login(form);
    });

  return section;
}


async function login(form) {
    const objecteSessio = {
      email: form.elements.email.value.trim(),
      password: form.elements.password.value
    };
    let response = await fetch(
      loginUrl,
      {
        method: "post",
        headers: {
          apiKey: APIKEY_anon_public,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objecteSessio)
      }
    );

    let data = await response.json();
    console.log("Resposta:")
    console.log(data);
  
}
