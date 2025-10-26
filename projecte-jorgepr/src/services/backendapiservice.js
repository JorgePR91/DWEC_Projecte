/*
TODO_FUTURE Mètode getBearer: bàsicament és un token d'usuari, s'introdueix en la petició dins dels headers, en l'atribut autorization. Ha de començar per "Bearer ****"". Castillo el busca en el localStorage amb el nom access_token.
*/
import {
  APIKEY_anon_public,
  singUpUrl,
  loginUrl,
  updateUrl,
} from "../enviroment";
export { login, singIN, updateUser };

// [x] MÈTODE DE CREACIÓ DE Headers
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
//Mètode de donar tokens


// [x] Mètode per a enviar a supabase
// NOTE Sempre transformem el que rebem del server en json i després el transformem en objecte amb stifly eixe
const sendSupabase = async (url, contingut) => {
  console.log(contingut);

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

// [x] Mètode per a configurar el login enciatn a supabase
const peticioPost = ({ hedaerData = null, body } = {}) => {
  return {
    method: "POST",
    headers: hedaerData ? crearHeader(hedaerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};
const peticioPatch = ({ hedaerData = {}, body = {} } = {}) => {
  return {
    method: "PATCH",
    headers: hedaerData ? crearHeader(hedaerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};

// [x] Mètode per a configurar el singin enciatn a supabase

// [x]  Mètode de login guardant la info en localStorage
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
      body: dadesUsuari,
    })
  );
};

// [ ] Mètode per a carregar la foto

/* COMENT Separación clara de capas:
    fetchSupabase: Capa de infraestructura (HTTP)
    loginSupabase/registerSupabase: Capa de servicios API
    login/register: Capa de aplicación/lógica de negocio */
