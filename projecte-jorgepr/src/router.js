export { router };

const routes = new Map([
  ["", "app-login"],
  ["#", "app-login"],
  ["#game", "app-eleccio-btn"],
  ["#login", "app-login"],
  ["#register", "app-profile"],
  ["#profile", "app-profile"],
  ["#partides", "app-partides-list"],
  ["#tamany", "app-eleccio-btn"],
]);


function parseRoute(hash) {
  const [route, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString || "");
  return { route, params };
}

async function router(hash, container) {
  const { route, params } = parseRoute(hash);

const protegides =   ["#game", "#profile", "#partides", "#partides"];

const autenticacio = () => {
  let userId = localStorage.getItem('access_token') || null;
  let user = localStorage.getItem('user') || null;
  
  return user && userId;
}


  if (routes.has(route)) {
if (protegides.includes(route) && !autenticacio()) {
  window.location.hash = '#';
  return;
}

    const componentName = routes.get(route);
    let element = document.createElement(componentName);

    // Configurar atributos según la ruta
    if (route === "#register") {
      element.setAttribute("titol", "Uneix-te al joc");
      element.setAttribute("subtitol", "Crea't un compte per a començar a jugar");
    } else if (route === "#profile") {
      element.setAttribute("titol", "Perfil");
      element.setAttribute("subtitol", "Modifica el teu perfil");
    } else if (route === "#game") {
      if(params.has('volum') || params.has('partida_id')) {
        element.remove();
        element = document.createElement('app-game');
        params.has('volum') && element.setAttribute('volum', params.get('volum'))
      } else 
      window.location.hash = '#tamany';
    } else if (route === "#tamany") {
      element.setAttribute("titol", "Tria la mida del tauler");
      element.setAttribute("subtitol", "Selecciona la dificultat del joc segons la mida");
    }

    container.replaceChildren(element);
  } else {
    container.innerHTML = `
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="mb-4 text-4xl font-bold glow-text">Error 404</h1>
        <p class="mb-4 text-xl text-muted-foreground">Error al carregar la pàgina</p>
        <a href="/" class="text-primary underline hover:text-primary/80">
          Tornar a l'inici
        </a>
      </div>
    </div>`;
  }
}
