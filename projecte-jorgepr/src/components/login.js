export {renderLogin}



function renderLogin(){

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
                      type="text"
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

    function muntatge(){

        //https://www.javascripttutorial.net/javascript-dom/javascript-form/

    const form = document.forms[0];
    const submit = document.querySelector('#enviarBtn');

    submit.addEventListener('click', (event) => {
        event.preventDefault();
        validacions(form);
    })
}

    return {codi, muntatge};
}

function validacions(form) {

    const user = form.elements.usuari;
    const pwd = form.elements.pwd;

    if(!/.{3,10}/.test(user.value))
        console.log("L'usuari ha de contenir entre 3 i 10 caracters.");

    if(!/.{4,10}/.test(pwd.value))
        console.log("La contrasenya ha de contenir entre 4 i 10 caracters.");

    if(!/^.{3,10}(?![A-Z]+)(?![\/\-*,@.]+)$/.test(user.value))
        console.log("L'usuari ha de contenir una majúscula i un símbol (-/*.,@|).");
    console.log('validant '+form.element)
}