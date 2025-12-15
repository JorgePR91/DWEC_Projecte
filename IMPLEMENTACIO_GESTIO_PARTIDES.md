# Implementació del Sistema de Gestió de Partides

## Resum

S'ha implementat un sistema complet per a gestionar partides guardades del joc de la serp, que inclou:

1. **Guardar partides** prement espai durant el joc
2. **Llistar partides guardades** en un component dedicat
3. **Carregar partides** des de la llista
4. **Eliminar partides** automàticament quan finalitzen
5. **Actualitzar partides** si ja existeix una partida del mateix tauler

## Arxius Modificats i Creats

### 1. Servei de Backend - [backendapiservice.js](src/services/backendapiservice.js)

**Noves funcions exportades:**
- `guardarPartida(dadesPartida)` - Guarda o actualitza una partida
- `obtenirPartides(userId)` - Obté la llista de partides de l'usuari
- `obtenirPartida(partidaId)` - Obté una partida específica amb tots els detalls
- `eliminarPartida(partidaId)` - Elimina una partida de la base de dades

**Característiques:**
- `guardarPartida` comprova si ja existeix una partida del mateix tauler i la sobreescriu
- Totes les funcions gestionen errors adequadament
- Utilitzen els tokens d'autenticació del localStorage

### 2. Component del Joc - [app-game.js](src/components/UI/app-game/app-game.js)

**Modificacions:**
- **Línia 3**: Importa `obtenirPartida` i `eliminarPartida`
- **Línies 16-17**: Noves propietats `_partidaCarregada` i `_partidaId`
- **Línies 20-37**: `connectedCallback` ara és async i carrega partida si hi ha `partida_id` a la URL
- **Línies 290-326**: Nou mètode `guardarEstatPartida()` amb feedback visual
- **Línies 475-504**: `finalitzarJoc()` ara elimina la partida de la BD quan finalitza
- **Línies 504-539**: `iniciJoc()` carrega dades de partida guardada si n'hi ha

**Flux de treball:**
1. Si la URL conté `?partida_id=X`, es carrega la partida
2. Durant el joc, es pot guardar prement **espai**
3. Quan el joc finalitza, la partida s'elimina automàticament de la BD

### 3. Nou Component - [app-partides-list.js](src/components/UI/app-partides-list/app-partides-list.js)

**Component complet per a gestionar partides:**
- Llista totes les partides de l'usuari
- Mostra: tauler, punts, direcció, data de guardada
- Botons per **carregar** i **eliminar** cada partida
- Estètica consistent amb login i profile
- Missatges de confirmació abans d'eliminar
- Feedback visual d'èxit/error

**Estructura de la taula:**
```
| Tauler | Punts | Direcció | Data guardada | Accions |
|--------|-------|----------|---------------|---------|
| 20x20  |   5   |  ↑ Dalt  | 15/12 10:30  | ▶ 🗑   |
```

### 4. Component Profile - [app-profile.js](src/components/UI/app-profile/app-profile.js)

**Modificacions (línies 601-616):**
- Detecta si està en mode "Perfil" (no "Registre")
- Mostra botó "📋 Gestionar les meues partides" que redirigeix a `#partides`

### 5. Router - [router.js](src/router.js)

**Modificació (línia 10):**
```javascript
["#partides", "app-partides-list"],
```

Ara la ruta `#partides` renderitza el component `app-partides-list`

### 6. Main - [main.js](src/main.js)

**Modificació (línia 11):**
```javascript
import "./components/UI/app-partides-list/app-partides-list";
```

Importa el nou component per registrar-lo

## Estructura de la Base de Dades

### Taula `partides`

Consulta el fitxer [ESTRUCTURA_TABLA_PARTIDES.md](ESTRUCTURA_TABLA_PARTIDES.md) per al script SQL complet.

**Camps principals:**
- `id` - Identificador únic
- `user_id` - Referència a l'usuari (UUID)
- `serp` - Array JSONB amb posicions de la serp
- `poma` - Objecte JSONB amb posició de la poma
- `direccio` - TEXT (dalt/baix/esquerra/dreta/estatic)
- `punts` - INTEGER
- `volum` - INTEGER (mida del tauler)
- `data_guardat` - TIMESTAMP

**Polítiques RLS:**
- Els usuaris només poden veure/crear/eliminar les seves pròpies partides

## Flux de Treball Complet

### Guardar una partida:

1. Usuari juga al joc
2. Prem **espai** → estat canvia a "guardat"
3. El component captura l'estat actual (serp, poma, direcció, punts, volum)
4. Crida `guardarPartida()` del servei
5. El servei comprova si ja existeix una partida d'aquest tauler
   - Si existeix → actualitza (PATCH)
   - Si no existeix → crea nova (POST)
6. Mostra missatge "✓ Partida guardada" durant 2 segons
7. Prem **espai** de nou → torna a estat "jugant"

### Veure partides guardades:

1. Usuari va a `#profile`
2. Clica "📋 Gestionar les meues partides"
3. Redirigeix a `#partides`
4. El component `app-partides-list` carrega automàticament:
   - Crida `obtenirPartides()`
   - Mostra taula amb totes les partides ordenades per data

### Carregar una partida:

1. A la llista de partides, clica "▶ Carregar"
2. Redirigeix a `#game?volum=X&partida_id=Y`
3. El component `app-game`:
   - Detecta `partida_id` a la URL
   - Crida `obtenirPartida(partidaId)`
   - Inicialitza el joc amb les dades guardades:
     - Posició de la serp
     - Posició de la poma
     - Direcció actual
     - Puntuació
4. L'usuari pot continuar jugant des d'on ho va deixar

### Eliminar partida al finalitzar:

1. El joc finalitza (per límit o col·lisió)
2. `finalitzarJoc()` comprova si `_partidaId` existeix
3. Si existeix → crida `eliminarPartida(partidaId)`
4. Mostra "✓ Partida finalitzada i eliminada" durant 3 segons
5. Neteja `_partidaId` i `_partidaCarregada`

### Eliminar partida manualment:

1. A la llista de partides, clica "🗑 Eliminar"
2. Mostra confirmació: "Estàs segur que vols eliminar aquesta partida?"
3. Si confirma:
   - Crida `eliminarPartida(partidaId)`
   - Recarrega la llista
   - Mostra "Partida eliminada correctament"

## Característiques Destacades

### ✅ Actualització intel·ligent
Si guardes una partida i ja tens una d'aquest mateix tauler, la sobreescriu en lloc de crear una duplicada.

### ✅ Feedback visual
Tots els missatges d'èxit/error apareixen temporalment amb estils Bootstrap:
- Verd per èxit
- Vermell per error
- Blau per informació

### ✅ Neteja automàtica
Quan finalitzes una partida carregada, s'elimina automàticament de la BD per no deixar partides "mortes".

### ✅ Seguretat
- Totes les peticions utilitzen el token d'autenticació
- RLS a Supabase garanteix que només veus les teves partides
- Validació del `user_id` abans de guardar/carregar

### ✅ Experiència d'usuari
- Estètica consistent amb la resta de l'aplicació
- Icones visuals per a direccions (↑↓←→)
- Dates formatades en català
- Confirmació abans d'eliminar

## Com Utilitzar-ho

### Per l'usuari:

1. **Jugar i guardar:**
   - Accedeix a `#game` o `#tamany`
   - Juga i prem **espai** per guardar

2. **Veure partides:**
   - Ve a `#profile`
   - Clica "📋 Gestionar les meues partides"

3. **Carregar partida:**
   - A la llista, clica "▶ Carregar" a qualsevol partida

4. **Eliminar partida:**
   - A la llista, clica "🗑 Eliminar"
   - Confirma l'acció

### Per al desenvolupador:

1. **Crear la taula a Supabase:**
   - Còpia el script de [ESTRUCTURA_TABLA_PARTIDES.md](ESTRUCTURA_TABLA_PARTIDES.md)
   - Executa'l al SQL Editor de Supabase

2. **Provar localment:**
   ```bash
   npm run dev
   ```

3. **Verificar:**
   - Juga i guarda partides
   - Comprova que apareixen a `#partides`
   - Carrega una partida i verifica que continua correctament
   - Finalitza una partida i comprova que s'elimina

## Solució de Problemes

### Error: "No hi ha sessió d'usuari activa"
- Assegura't que l'usuari ha fet login
- Comprova que `localStorage` té `user_id` i `access_token`

### Les partides no es carreguen
- Verifica que la taula `partides` existeix a Supabase
- Comprova les polítiques RLS
- Revisa la consola per errors de permisos

### La partida no es guarda
- Comprova que el token d'accés és vàlid
- Verifica que tots els camps requerits estan presents
- Revisa la consola del navegador per errors

## Millores Futures Possibles

- [ ] Limitar el nombre de partides guardades per usuari (màx. 5)
- [ ] Afegir captura de pantalla del tauler en guardar
- [ ] Estadístiques de partides (temps jugat, millor puntuació, etc.)
- [ ] Compartir partides amb altres usuaris
- [ ] Mode multijugador amb partides guardades
- [ ] Historial de moviments per replay

## Resum Tècnic

- **Línies de codi afegides:** ~500
- **Nous arxius:** 2 (component + documentació estructura BD)
- **Arxius modificats:** 5
- **Noves funcions API:** 4
- **Temps estimat d'implementació:** Completat ✅
