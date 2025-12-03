

import {
  APIKEY_anon_public,
  singUpUrl,
  loginUrl,
  updateUrl,
} from "../enviroment";
export { login, singIN, updateUser };

// [x] MÈTODE DE CREACIÓ DE Headers (JCastillo)
// entrada: atributs dels headers
// eixida: headers per a les peticions
// NOTE Sentit: practicar la composició de paràmetres com atributs i per a poder fer peticions més complexes i diferents
const crearHeader = ({
  ContentType = "application/json",
  Authorization = `Bearer ${APIKEY_anon_public}`,
  ApiKey = APIKEY_anon_public,
  Prefer = null,
} = {}) => {
  const header = new Headers();
  ContentType && header.append("Content-Type", ContentType);
  Authorization && header.append("Authorization", `Bearer ${Authorization}`);
  ApiKey && header.append("ApiKey", ApiKey);
  Prefer && header.append("Prefer", Prefer);
  return header;
};
//Mètode de donar tokens o bearer per a les peticions6, reb ¿? retonna el token de localstorage.
/*
TODO_FUTURE Mètode getBearer: bàsicament és un token d'usuari, s'introdueix en la petició dins dels headers, en l'atribut autorization. Ha de començar per "Bearer ****"". Castillo el busca en el localStorage amb el nom access_token.
*/


// [x] Mètode per a enviar a supabase (JCastillo)
// entrada: url i contingut de la petició
// eixida: resposta del servidor o error
// NOTE Sempre transformem el que rebem del server en json i després el transformem en objecte amb stifly eixe
const sendSupabase = async (url, contingut) => {
  try {
    const resposta = await fetch(url, contingut);
    if (resposta.ok) {
      return await resposta.json();
    } else {
      throw await resposta.json();
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// [x] Mètode per a configurar la petició a supabase
// entrada: headers i contingut de la petició
// eixida: resposta del servidor
const peticioPost = ({ hedaerData = null, body } = {}) => {
  return {
    method: "POST",
    headers: hedaerData ? crearHeader(hedaerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};
const peticioGet = ({ hedaerData = null } = {}) => {
  return {
    method: "GET",
    headers: hedaerData ? crearHeader(hedaerData) : crearHeader(),
  };
};
const peticioPatch = ({ hedaerData = {}, body = {} } = {}) => {
  return {
    method: "PATCH",
    headers: hedaerData ? crearHeader(hedaerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};

// [x] Mètode per a agafar dades de Profiles a supabase
// entrada: id de l'usuari (per defecte el de localstorage), token d'accés (per defecte el de localstorage)
// eixida: objecte profile amb les dades de l'usuari i la imatge
export const getProfile = async (id = localStorage.getItem("user_id"), token = localStorage.getItem("access_token")) => {
  let profile =  await sendSupabase(`id=eq.${id}&select=*`, peticioGet({
hedaerData : { Authorization: `Bearer ${token}`}
  }));
  if(!profile.length) return null;
  let urlImg = profile[0].avatar_url;
  
  //Li clavem les propietats que volem afegir de la taula.
  // -- volem un camp per a la imatge en blob
  profile[0].avatar_blob = false;

  if (urlImg) {
    let imageData = await sendSupabase(urlImg, peticioGet({Authorization: `Bearer ${token}`}));
    // imageData.status !== ok&& return null;
    if(imageData instanceof Blob)
      profile[0].avatar_blob = URL.createObjectURL(imageData);
    //URL.revokeObjectURL(). al tancar sessió per a borrar-la
  }
  return profile[0];
}

//[ ] Normalitzar nom de imatge, canviar pel correu.
// [x]  Mètode de login guardant la info en localStorage
// entrada: Necessita les dades de formulari
// internament: toca el localStorage
// eixida: resposta del servidor
const login = async (dadesUsuari) => {
  const resultat = await sendSupabase(
    loginUrl,
    peticioPost({ body: dadesUsuari })
  );
  
  localStorage.setItem("access_token", resultat.access_token);
  localStorage.setItem("refresh_token", resultat.refresh_token);
  localStorage.setItem("expires_in", resultat.expires_in);
  localStorage.setItem("user_email", resultat.user.email);
  localStorage.setItem("user", resultat.user.username);
  localStorage.setItem("user_id", resultat.user.id);

  return resultat;
};

// [x]  Mètode de singin guardant la info en localStorage
const singIN = async (dadesUsuari) => {
  return await sendSupabase(singUpUrl, peticioPost({ body: dadesUsuari }));
};

// [x] Mètode per a actualitzar genèric
const updateUser = async (id, access_token = undefined, dadesUsuari) => {
  console.log("UptadeUser method");
  console.log(dadesUsuari);

  return await sendSupabase(
    `${updateUrl}id=eq.${id}`,
    peticioPatch({
      hedaerData: { Authorization: access_token, Prefer: "return=representation" },
      body: dadesUsuari
    })
  );
};

// [ ] Mètode per a carregar la foto
// 1º Necessitem la foto quan es carrega la sessió, i quan és carrega el edit: l'usuari estarà donat d'alta i tindrem en localstorage 
// const chargePhoto = (id) => {
//   //està en localstorage
//   return localStorage.getItem("user_img")?
//     localStorage.getItem("user_img"): 
//     crearHeader({})
//     `${updateUrl}select=avatar_url`; 

// };

/* COMENT Separación clara de capas:
    fetchSupabase: Capa de infraestructura (HTTP)
    loginSupabase/registerSupabase: Capa de servicios API
    login/register: Capa de aplicación/lógica de negocio */
