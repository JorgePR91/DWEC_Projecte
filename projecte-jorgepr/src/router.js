import { renderContent } from "./components/content";
import { renderLogin } from "./components/login";
import { renderRegister } from "./components/register";

export { router };

const routes = new Map([
  ["#", ],
  ["#game", renderContent],
  ["#login", renderLogin],
  ["#register", renderRegister],
]);

//SI
async function router(route, container) {
  if (routes.has(route)) {
      container.replaceChildren(routes.get(route)());
  } else {
    container.innerHTML = `
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold glow-text">Error 404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Error al carregar la pàgina</p>
        <a href="/" className="text-primary underline hover:text-primary/80">
          Return to Home
        </a>
      </div>
    </div>`;
  }
}
