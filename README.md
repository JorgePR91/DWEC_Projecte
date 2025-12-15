# DWEC_Projecte

📘 Projecte del mòdul **Desenvolupament Web en Entorn Client (DWEC)** del Cicle Formatiu de Grau Superior en Desenvolupament d’Aplicacions Web.

Aquest repositori conté una **aplicació web desenvolupada en l’entorn client**, fent ús de **JavaScript Vnilla**, **HTML5**, **CSS3** i amb les eines de **Node.js**, **RxJS** i **Vite** per a la gestió de dependències i el desplegament.

L'aplicació es basa en un joc estil IOGame amb autenticació i gestió de perfil d'usuari. La temàtica gira al voltant d'una estètica futurista per arribar a un dels jocs, ja més classics: Snake 🐍

EN quant a la part visual, s'ha intentat jugar amb estètica futurista (colors neons) i clàssica o pixelada (xarxa quadrada per al joc) donant un híbrid entre modernitat i classiquisme digital.

🔗 **Aplicació desplegada:**  
https://jpr-gameio.vercel.app

---

## 🏗️ Arquitectura del projecte

El projecte segueix una estructura modular per a facilitar el manteniment, la llegibilitat i l’escalabilitat del codi.

### 📂 Estructura de carpetes

- **`.vscode/`**  
  Configuració de l’entorn de desenvolupament (extensions, ajustos de depuració).

- **`node_modules/`**  
  Dependències del projecte instal·lades mitjançant npm.

- **`projecte-jorgepr/`**  
  Nucli de l’aplicació web. Conté:
  - Arxius HTML (estructura) utilitzant **Web Components**
  - Fulls d’estil CSS (presentació) generals (el projecte empra Bootstrap)
  - Arxius JavaScript (lògica i interacció) --> Web Componenst

- **`.gitignore`**  
  Exclusió d’arxius generats automàticament o no necessaris per al control de versions.

- **`package.json`**  
  Defineix:
  - Metadades del projecte
  - Dependències
  - Scripts d’execució i construcció

- **`package-lock.json`**  
  Control exacte de versions de les dependències.

---

## 🧠 Lògica del programa

La lògica de l’aplicació està implementada principalment en **JavaScript** i es basa en:

- Manipulació del **DOM** per a actualitzar dinàmicament la interfície
- Gestió d’esdeveniments de l’usuari (clics, entrades de formulari, accions interactives) per a la interacció amb l'UI
- Control de l’estat de l’aplicació mitjançant variables, observables i esdeveniments personalitzats.
- Separació radical entre:
  - Lògica de serveis (peticions a l'Api) separada segons la seua utilitat i funció.
  - Lògica de negoci (el funcionament del joc) encapsulada en un WebComponent, autònom del renderitzat.
- Separació interna entre:
  - Renderitzat dels components
  - Lògica de funcionament
  - Establiment d'esdeveniments i contacte entre components

El flux de l’aplicació està orientat a l’usuari, responent en temps real a les seues accions sense necessitat de recàrrega de la pàgina.

---

## 🔄 Comunicació interna

La comunicació interna de l’aplicació es realitza mitjançant:

- **Interacció entre mòduls JavaScript**, utilitzant funcions reutilitzables i estructurades
- Passatge de dades entre funcions per a mantindre l’estat de l’aplicació utilitzant en gran mesura observables.
- Actualització del DOM com a mecanisme principal de retroalimentació visual
- Possible ús d’esdeveniments personalitzats o callbacks per a coordinar accions internes

En cas d’utilitzar APIs o serveis externs, la comunicació es realitza mitjançant **peticions asíncrones** (fetch), garantint una experiència fluida per a l’usuari. 

---

## ⚙️ Tecnologies utilitzades

- **HTML5** – Estructura semàntica de l’aplicació
- **CSS3** – Disseny i maquetació
- **Bootstrap** - Estètica i disseny
- **JavaScript (ES6+)** – Lògica del client
- **Node.js** – Entorn d’execució
- **npm** – Gestió de dependències
- **Vercel** – Desplegament de l’aplicació
- **RxJS** – Biblioteca per a programció reactiva

---

## 🚀 Execució del projecte en local

### Requisits previs
- Node.js
- npm

### Passos

1. Clonar el repositori:
   ```bash
   git clone https://github.com/JorgePR91/DWEC_Projecte.git

2. Accedir al directori del projecte:
   ```bash
   cd DWEC_Projecte

4. Instal·lar dependències:
   ```bash
   npm install

5. Executar el projecte:
   ```bash
   npm start
