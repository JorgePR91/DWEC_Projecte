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
  guardarPartida,
  obtenirPartides,
  obtenirPartida,
  eliminarPartida,
  logout,
};
import {
  actualitzarUsuari,
  actualitzarAtributUsuari,
  getUsuariValue,
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
      headerData: { Authorization: `Bearer ${token}` },
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
        peticioGet({ headerData: { Authorization: `Bearer ${token}` } })
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
    user_id: resultat.user.id,
    user_avatar: userData.imgSRC,
    user_games: [],
  };

  actualitzarUsuari(usuariLogejat);

  return resultat;
};

const getSessio = () => {
  return localStorage.getItem("user_id");
};

// [x] Mètode per a tancar sessió
// entrada: cap
// internament: neteja el localStorage i revoca les URLs de blobs per alliberar memòria
// eixida: void
const logout = () => {
  // Revocar URLs de blobs per alliberar memòria
  const avatarUrl = localStorage.getItem("user_avatar");
  if (avatarUrl && avatarUrl.startsWith("blob:")) {
    URL.revokeObjectURL(avatarUrl);
  }
  const usuariActual = getUsuariValue();
  if (
    usuariActual.user_avatar &&
    usuariActual.user_avatar.startsWith("blob:")
  ) {
    URL.revokeObjectURL(usuariActual.user_avatar);
  }
  // Netejar localStorage
  localStorage.clear();

  actualitzarUsuari({
    access_token: "",
    refresh_token: "",
    expires_in: "",
    user_email: "",
    user_id: "",
    user: "",
    user_avatar: "",
    user_games: [],
  });
  // Redirigir a login
  window.location.hash = "#login";
};

// [x]  Mètode de singin guardant la info en localStorage
const registrarSe = async (dadesUsuari) => {
  const resultat = await sendSupabase(
    singUpUrl,
    peticioPost({ body: dadesUsuari })
  );

  if (!resultat || !resultat.user) {
    throw new Error("Error al registrar-se: resposta incompleta del servidor");
  }

  return resultat;
};

const actualitzar = async ({ id, dadesUsuari }) => {
  let avatar = null;
  if (dadesUsuari.avatar) {

    const resultatImg = await updateImg({ id, dadesUsuari });

    if (resultatImg.error) {
      console.log(resultatImg.error);
    } else {
      avatar = resultatImg.Key;
      // Actualitzar avatar_url a la base de dades
      dadesUsuari.avatar_url = avatar;
    }
  }

  // Eliminar el blob abans d'enviar a la base de dades
  delete dadesUsuari.avatar;

  const resultatPerfil = await updateUser({ id, dadesUsuari });

  if (resultatPerfil.error) {

    throw resultatPerfil;
  }

  if (dadesUsuari.username) {

    actualitzarAtributUsuari({ atribut: "user", value: dadesUsuari.username });
  }
  if (avatar) {

    const nouAvatar = await getImage(avatar);

    actualitzarAtributUsuari({
      atribut: "user_avatar",
      value: nouAvatar,
    });
  }

  return resultatPerfil;
};

const updateUser = async ({ id, dadesUsuari }) => {
  const token = localStorage.getItem("access_token");
  const resultat = await sendSupabase(
    `${supaUrl}/rest/v1/profiles?id=eq.${id}`,
    peticioPatch({ 
      headerData: { 
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation"
      }, 
      body: dadesUsuari 
    })
  );

  return resultat;
};


// [x] Mètode per a actualitzar Imatge
//dadesUsuari.avatar!!!!!!!!!!!!!!!!!!!!!!!!
const updateImg = async ({ id, dadesUsuari }) => {
  const avatarBlob = dadesUsuari.avatar;
  const avatarName = `avatar_${id}.jpg`;

  let formImg = new FormData();
  formImg.append("avatar", avatarBlob, avatarName);

  const headers = crearHeader({ ContentType: null });
  headers.append("x-upsert", true);
  const resultat = await sendSupabase(
    `${supaUrl}/storage/v1/object/avatars/${avatarName}`,
    {
      method: "POST",
      headers: headers,
      body: formImg,
    }
  );

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

const guardarPartida = async (dadesPartida) => {
  const userId = dadesPartida.user_id || localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  if (!userId || !token) {
    throw new Error("No hi ha sessió d'usuari activa");
  }

  const partidaData = {
    user_id: userId,
    serp: dadesPartida.serp,
    poma: dadesPartida.poma,
    direccio: dadesPartida.direccio,
    punts: dadesPartida.punts,
    volum: dadesPartida.volum,
    data_guardat: new Date().toISOString(),
  };

  try {
    const partidesExistents = await sendSupabase(
      `${supaUrl}/rest/v1/partides?user_id=eq.${userId}&volum=eq.${dadesPartida.volum}&select=id`,
      peticioGet({
        headerData: { Authorization: `Bearer ${token}` },
      })
    );

    let resultat;

    if (partidesExistents && partidesExistents.length > 0) {
      const partidaId = partidesExistents[0].id;
      resultat = await sendSupabase(
        `${supaUrl}/rest/v1/partides?id=eq.${partidaId}`,
        peticioPatch({
          headerData: {
            Authorization: `Bearer ${token}`,
            Prefer: "return=representation",
          },
          body: partidaData,
        })
      );
      console.log("Partida actualitzada amb èxit:", resultat);
    } else {
      resultat = await sendSupabase(
        `${supaUrl}/rest/v1/partides`,
        peticioPost({
          headerData: {
            Authorization: `Bearer ${token}`,
            Prefer: "return=representation",
          },
          body: partidaData,
        })
      );
      console.log("Partida nova guardada amb èxit:", resultat);
    }

    return resultat;
  } catch (error) {
    console.error("Error guardant la partida:", error);
    throw error;
  }
};

const obtenirPartides = async (userId = null) => {
  const user_id = userId || localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  if (!user_id || !token) {
    throw new Error("No hi ha sessió d'usuari activa");
  }

  try {
    const resultat = await sendSupabase(
      `${supaUrl}/rest/v1/partides?user_id=eq.${user_id}&select=id,punts,volum,direccio,data_guardat&order=data_guardat.desc`,
      peticioGet({
        headerData: { Authorization: `Bearer ${token}` },
      })
    );

    return resultat || [];
  } catch (error) {
    console.error("Error obtenint les partides:", error);
    throw error;
  }
};

const obtenirPartida = async (partidaId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hi ha sessió d'usuari activa");
  }

  try {
    const resultat = await sendSupabase(
      `${supaUrl}/rest/v1/partides?id=eq.${partidaId}&select=*`,
      peticioGet({
        headerData: { Authorization: `Bearer ${token}` },
      })
    );

    if (!resultat || resultat.length === 0) {
      throw new Error("Partida no trobada");
    }

    return resultat[0];
  } catch (error) {
    console.error("Error obtenint la partida:", error);
    throw error;
  }
};

const eliminarPartida = async (partidaId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No hi ha sessió d'usuari activa");
  }

  try {
    await sendSupabase(`${supaUrl}/rest/v1/partides?id=eq.${partidaId}`, {
      method: "DELETE",
      headers: crearHeader({ Authorization: `Bearer ${token}` }),
    });

    console.log("Partida eliminada amb èxit");
  } catch (error) {
    console.error("Error eliminant la partida:", error);
    throw error;
  }
};
