export { renderRegister };

function renderRegister(){
    const codi = `
    <div class="card glow-effect">
            <div class="card-header">
                <h3 class="card-title glow-text">Join the Game</h3>
                <p class="card-description">Create your account to start playing</p>
            </div>
            <div class="card-content">
                <form class="form" onsubmit="return handleSubmit(event)">
                    <div class="form-group">
                        <label class="label" for="username">Username</label>
                        <input 
                            class="input" 
                            id="username" 
                            type="text" 
                            placeholder="PlayerOne"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="email">Email</label>
                        <input 
                            class="input" 
                            id="email" 
                            type="email" 
                            placeholder="player@iogame.com"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="password">Password</label>
                        <input 
                            class="input" 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="label" for="confirmPassword">Confirm Password</label>
                        <input 
                            class="input" 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="••••••••"
                            required
                        />
                        <span class="error" id="error-message" style="display: none;"></span>
                    </div>
                    <button type="submit" class="button">Register</button>
                    <p class="text-center">
                        Already have an account? 
                        <a href="/login" class="link">Login here</a>
                    </p>
                </form>
            </div>
        </div>`;
    const section = document.createElement("section");
  section.innerHTML = codi;

    return section;
}