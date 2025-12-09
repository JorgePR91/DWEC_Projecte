import {
  APIKEY_anon_public,
  loginUrl,
  singUpUrl,
  supaUrl,
} from "../enviroment";
export {
  login,
  registrarSe as singIN,
  updateUser,
  getSessio,
  actualitzar,
  getImage,
};
//import * from './userSessionService.js';
import {
  actualitzarUsuari,
  actualitzarAtributUsuari,
} from "./userSessionService";

//BehaviourSubject per a l'usuari, idea de JCastillo, supose que l'elecció de BS respon a la necessitat d'escoltar i enviar l'usuari, així estar preparat per a canvis amb les peticions al servidor. OneMoreCopyPaste

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
  Authorization && header.append("Authorization", Authorization);
  ApiKey && header.append("ApiKey", ApiKey);
  Prefer && header.append("Prefer", Prefer);
  return header;
};
//Mètode de donar tokens o bearer per a les peticions6, reb ¿? retonna el token de localstorage.
/*
TODO_FUTURE Mètode getBearer: bàsicament és un token d'usuari, s'introdueix en la petició dins dels headers, en l'atribut autorization. Ha de començar per "Bearer ****"". Castillo el busca en el localStorage amb el nom access_token. Jo el faig en els mètodes de login i registre, el seu és més exportable, però no puc copiar tot el que faça don senyor mestre.
*/

// [x] Mètode per a enviar a supabase (JCastillo)
// entrada: url i contingut de la petició
// eixida: resposta del servidor o error
// NOTE Sempre transformem el que rebem del server en json i després el transformem en objecte amb stifly eixe
const sendSupabase = async (url, contingut) => {
  try {
    const resposta = await fetch(url, contingut);
    if (resposta.ok) {
      // ✅ MEJORA IA: manejar casos donde no hay contenido
      //Molt bo! si no hi ha content type envia el blob que passarà en els casos de les imatges, però si envia dades d'usuari, enviarà la resposta convertida a json
      const contentType = resposta.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await resposta.json();
      }
      return await resposta.blob(); // Para imágenes u otros archivos
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
const peticioPost = ({ headerData = null, body } = {}) => {
  return {
    method: "POST",
    headers: headerData ? crearHeader(headerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};

const peticioGet = ({ headerData = null } = {}) => {
  return {
    method: "GET",
    headers: headerData ? crearHeader(headerData) : crearHeader(),
  };
};

const peticioPatch = ({ headerData = {}, body = {} } = {}) => {
  return {
    method: "PATCH",
    headers: headerData ? crearHeader(headerData) : crearHeader(),
    body: JSON.stringify(body),
  };
};

// [x] Mètode per a agafar dades de Profiles a supabase
// entrada: id de l'usuari (per defecte el de localstorage), token d'accés (per defecte el de localstorage)
// eixida: objecte profile amb les dades de l'usuari i la imatge
export const getProfile = async ({
  id = localStorage.getItem("user_id"),
  token = localStorage.getItem("access_token"),
}) => {
  let profile = await sendSupabase(
    `${supaUrl}/rest/v1/profiles?id=eq.${id}&select=*`,
    peticioGet({
      headerData: { Authorization: token },
    })
  );
  if (!profile.length) return null;
  let urlImg = profile[0].avatar_url;

  //Li clavem les propietats que volem afegir de la taula.
  // -- volem un camp per a la imatge en blob
  profile[0].avatar_blob = false;

  if (urlImg) {
    //IA aconsella un try/catch
    try {
      let imageData = await sendSupabase(
        `${supaUrl}/storage/v1/object/${urlImg}`,
        peticioGet({ Authorization: token })
      );
      if (imageData instanceof Blob)
        profile[0].avatar_blob = URL.createObjectURL(imageData);
      //URL.revokeObjectURL(). al tancar sessió per a borrar-la
    } catch (error) {
      console.error("Error carregant avatar:", error);
    }
  }
  return profile[0];
};

// [x]  Mètode de login guardant la info en localStorage
// entrada: Necessita les dades de formulari
// internament: toca el localStorage i actualitza un observable d'usuari per a tindre la sessió iniciada.
// eixida: resposta del servidor
const login = async (dadesUsuari) => {
  const resultat = await sendSupabase(
    loginUrl,
    peticioPost({ body: dadesUsuari })
  );

  if (
    !resultat ||
    !resultat.access_token ||
    !resultat.user ||
    !resultat.user.id
  ) {
    throw new Error("Error al login: resposta incompleta del servidor");
  }

  const userData = (
    await sendSupabase(
      `${supaUrl}/rest/v1/profiles?id=eq.${resultat.user.id}&select=*`,
      peticioGet()
    )
  )[0];

  //Afegim primer la imatge que obtenim fent una altra petició a Supabase
  //Després l'afegim al Subject per a que estiga disponible al header, al perfil
  //Després afegim la info que ens ha donat el login i la clavem també al subject. encara que no sé si és necessari perquè ja tenim al LocalStorage
  userData.imgSRC = await getImage(userData.avatar_url);

  const usuariLogejat = {
    access_token: resultat.access_token,
    refresh_token: resultat.refresh_token,
    user_email: resultat.user.email,
    user: userData.username,
    user_id: userData.user.id,
    user_avatar: userData.imgSRC,
    user_games: [],
  };

  actualitzarUsuari(usuariLogejat);

  return resultat;
};

const getSessio = () => {
  return localStorage.getItem("user_id");
};

// [x]  Mètode de singin guardant la info en localStorage
const registrarSe = async (dadesUsuari) => {
  const resultat = await sendSupabase(
    singUpUrl,
    peticioPost({ body: dadesUsuari })
  );
  if (resultat.status !== 200) throw resultat;
};

const actualitzar = async ({ id, dadesUsuari }) => {
  if (dadesUsuari.avatar) {
    const resultatImg = await updateImg(id, dadesUsuari);
    if (resultatImg.error) {
      console.log(resultatImg.error);
    }
  }
  const resultatPerfil = await updateUser({ id, dadesUsuari });

  if (resultatPerfil.error) {
    throw resultatPerfil;
  }

  if (dadesUsuari.username) {
    actualitzarAtributUsuari({ atribut: "user", value: dadesUsuari.username });
  }
  if (dadesUsuari.avatar) {
    const nouAvatar = await getImage(dadesUsuari.avatar_url);
    actualitzarAtributUsuari({
      atribut: "user_avatar",
      value: nouAvatar,
    });
  }

  return resultatPerfil;
};

const updateUser = async ({ id, dadesUsuari }) => {
  const headers = crearHeader();
  headers.append("Prefer", "return=representation");
  const resultat = await sendSupabase(
    `${supaUrl}/rest/v1/profiles?id=eq.${id}`,
    peticioPatch({ headerData: headers, body: dadesUsuari })
  );

  return resultat;
};

// [x] Mètode per a actualitzar Imatge
//dadesUsuari.avatar!!!!!!!!!!!!!!!!!!!!!!!!
const updateImg = async ({ id, dadesUsuari }) => {
  console.log(dadesUsuari);

  const avatarBlob = dadesUsuari.avatar;
  const avatarName = `avatar_${id}.jpg`;

  let formImg = new FormData();
  formImg.append("avatar", avatarBlob, avatarName);

  const headers = crearHeader({ ContentType: null });
  headers.append("x-upsert", true);
  const resultat = await sendSupabase(
    `${supaUrl}/storage/v1/object/avatars/${avatarName}`,
    peticioPost({ headerData: headers, body: formImg })
  );
  dadesUsuari.avatar_url = resultat.Key;
  delete dadesUsuari.avatar;

  return resultat;
};

// [x] Mètode per a carregar la foto
//Copiem i modifiquem el mètode de JCastillo. No aprove tant de copiaPega però amb el temps que tenim i l'assimilació de conceptes en classe no es pot fer més... No estic agust amb aquesta docència... EN FI, CALLA'T QUE EN LA UNI HAVERES CALLAT
const getImage = async (fileUrl) => {
  if (!fileUrl) return null;

  try {
    const resposta = await sendSupabase(
      `${supaUrl}/storage/v1/object/${fileUrl}`,
      peticioGet()
    );
    //Amb la modificació del mètode de petció a Supabase, no cal comprovar si ens donen una resposta vàlida, perquè primer, sinó ja envia ell l'error, i segón, si és vàlida ja la convertirà en blob
    if (resposta instanceof Blob) {
      return URL.createObjectURL(resposta);
    }
    return null;
  } catch (error) {
    console.error("Error cargando imagen:", error);
    return null;
  }
};

/* COMENT Separación clara de capas:
    fetchSupabase: Capa de infraestructura (HTTP)
    loginSupabase/registerSupabase: Capa de servicios API
    login/register: Capa de aplicación/lógica de negocio */
