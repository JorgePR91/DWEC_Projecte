import { renderContent } from "./components/content";
import { renderLogin } from "./components/login";
import { renderRegister } from "./components/register";

export {router}

const routes = new Map([
    ['#',renderContent],
    ['#game',renderContent],
    ['#login',renderLogin],
    ['#register',renderRegister]
])

//SI
function router(route,container, volum){
    const ruta = routes.get(route);
    if(routes.has(route)){
//Copilot: posar-ho en un try catch per a comprovar si accepta tres arguments o no. Prova en tres, si se'ls traga renderitza, sols una vegada, no dues com abans, i renderitza des del router perquè la seua funció és carregar la pàgina i el continut principal del joc és la grid, per tant, ha de crear-la. En cas que no els accepte en compte de eixir-se'n, fa la alternativa del catch sense capturar l'error.
        try{
            //EXPLICAR
            container.innerHTML = ruta.length > 0 ? ruta(volum) : ruta();

        }catch {
        container.innerHTML = ruta();
        }
    }
    else {
        container.innerHTML = `<h2>Error 404: error al carregar la pàgina</h2>`
    }
}