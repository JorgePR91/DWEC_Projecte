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


function router(route,container){
    if(routes.has(route)){
        container.innerHTML = routes.get(route)();
    }
    else {
        container.innerHTML = `<h2>Error 404: error al carregar la pàgina</h2>`
    }
}