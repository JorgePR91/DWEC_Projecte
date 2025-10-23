export { renderLogin };
import { APIKEY } from "./enviroment";

function renderLogin() {
  //https://mdbootstrap.com/docs/standard/extended/login/
  const codi = `
                <section class="vh-100" style="background-color: #4f4f4fff">
        <div class="container py-5 h-100">
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
                    <label class="form-label" for="usuari">Usuari</label>
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

  const section = document.createElement("section");
  section.innerHTML = codi;

   const btn = section.querySelector("#enviarBtn");
   const form = section.getElementsByTagName("form")[0];

   btn.addEventListener("click", (event) => {
     event.preventDefault();
     console.log("enviar");
     registre(form);
    });

  return section;
}


async function registre(form) {
    const objecteSessio = {
      email: form.elements.usuari.value,
      password  : form.elements.pwd.value,
    };
    let response = await fetch(
      "https://psumfbkktptsjzrqpuus.supabase.co/auth/v1/signup",
      {
        method: "post",
        headers: {
          apiKey: APIKEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objecteSessio)
      }
    );

    let data = await response.json();
    console.log("Resposta:")
    console.log(data);
  
}
