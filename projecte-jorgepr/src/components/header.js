export {renderHeader}


function renderHeader(){

   return `
        <nav class="d-flex align-items-center justify-content-between h-100 px-3">
          <div class="d-flex align-items-center gap-2">
            <a href="#" class="fw-bold text-light fs-4 text-decoration-none logo glow-text">IO.Game</a>
            <div class="d-flex gap-2">
              <a href="#login" class="btn text-light px-2 py-1 rounded nav-button">Login</a>
              <a href="#register" class="btn text-light px-2 py-1 rounded nav-button">Register</a>
              <a href="#game" class="btn text-light px-2 py-1 rounded nav-button">Game</a>
            </div>
          </div>
          <div class="d-flex align-items-center gap-0.75">
            <span id="user" class="username m-2 fw-bold glow-text">${localStorage.getItem('user')}</span>
            <div id="userImg" class="avatar rounded-circle d-flex align-items-center justify-content-center glow-effect">
            <img class="d-block w-100 rounded-circle" src="/public/Smiley-Emoticon.png">
            </div>
          </div>
        </nav>
    `;
//¿ ? Per a calvar la imatge i el nom d'usuari ho fem amb un esdeveniment creat o agafant-ho de localStorage

  }