export { renderRegister };
import { APIKEY_anon_public, singUpUrl } from "./enviroment";

function renderRegister() {
  const codi1 = `
    <div class="card glow-effect">
            <div class="card-header">
                <h3 class="card-title glow-text">Join the Game</h3>
                <p class="card-description">Create your account to start playing</p>
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
                <h3 class="card-title glow-text">Join the Game</h3>
                <p class="card-description">Create your account to start playing</p>
            </div>
            <div class="card-content">
                <form class="form d-flex flex-column gap-3" >
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
                    <button id="enviarBtn" type="submit" class="button btn btn-primary w-100">Register</button>
                    <p class="text-center">
                        Already have an account? 
                        <a href="#login" class="link link-primary">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    `;
  const section = document.createElement("section");
  section.innerHTML = codi;

  const btn = section.querySelector("#enviarBtn");
  const form = section.getElementsByTagName("form")[0];

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    if (form.elements.password.value === form.elements.confirmPassword.value) {
      console.log("enviar");
      registre(form);
    }
  });

  return section;
}

async function registre(form) {
  const objecteSessio = {
    email: form.elements.email.value.trim(),
    password: form.elements.password.value
  };
  let response = await fetch(singUpUrl, {
    method: "post",
    headers: {
      apiKey: APIKEY_anon_public,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objecteSessio),
  });

  let data = await response.json();
  console.log("Resposta:");
  console.log(data);
}
