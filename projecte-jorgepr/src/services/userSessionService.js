import { BehaviorSubject, map } from "rxjs";

const $usuari = new BehaviorSubject({
  access_token: "",
  refresh_token: "",
  expires_in: "",
  user_email: "",
  user_id: "",
  user: "",
  user_avatar: "",
  user_games: [],
});

$usuari.subscribe((u) => u.user_id && sincronitzacioLocalStorage(u));

export const getUsuari = () => {
  return $usuari.asObservable();
};

export const getUsuariValue = () => {
  return $usuari.getValue();
};

export const getIDUsuari = () => {
  return $usuari.getValue().user_id;
};

export const $getAvatarUsuari = () => {
  return $usuari.pipe(map((u) => u.user_avatar));
};

export const getUsernameUsuari = () => {
  return $usuari.pipe(map((u) => u.user));
};

export const getGamesUsuari = () => {
  return $usuari.getValue().user_games;
};

export const getAccessTokenUsuari = () => {
  return $usuari.getValue().access_token;
};

export const $getGames = () => {
  return $usuari.pipe(map((u) => u.user_games));
};

export const actualitzarUsuari = (value) => {
  return $usuari.next(value);
};

export const actualitzarAtributUsuari = ({ atribut, value }) => {
  const aux = { ...$usuari.getValue(), [atribut]: value };

  //   const aux = $usuari.getValue(); --> Correcció de la IA BRUTAL!! el spread operator genera còpia d'objecte, com amb els arrays, i després busca l'atribut i si està el reemplaça, si no l'afegeix. Si haverem posat l'atribut davant, primer l'havera afegit i després havera copiat la resta. ALUCINANT
  //la qüestió és que el getValue no còpia sinó passa la referència i al reassignar-lo a un nou atribut estic creant un objecte prenyat del mateix objecte!!
  //   aux[atribut] = value;

  return $usuari.next(aux);
};

export const tancarSessio = () => {
  localStorage.clear();

  // Revocar URLs de blobs para liberar memoria (este fragment: IA)
  const avatar = $usuari.getValue().user_avatar;
  if (avatar && avatar.startsWith("blob:")) {
    URL.revokeObjectURL(avatar);
  }

  $usuari.next({
  access_token: "",
  refresh_token: "",
  expires_in: "",
  user_email: "",
  user_id: "",
  user: "",
  user_avatar: "",
  user_games: [],
});
};

const sincronitzacioLocalStorage = (user) => {
  localStorage.setItem("user", user.user);
  localStorage.setItem("access_token", user.access_token);
  localStorage.setItem("refresh_token", user.refresh_token);
  localStorage.setItem("expires_in", user.expires_in);
  localStorage.setItem("user_email", user.user_email);
  localStorage.setItem("user_id", user.user_id);
};
