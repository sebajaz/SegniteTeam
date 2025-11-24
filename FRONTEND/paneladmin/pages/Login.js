// Login Page Component
class LoginPage {
    constructor(onLogin) {
        this.onLogin = onLogin;
    }

    render() {
        const page = document.createElement('div');
        page.className = 'login-page';
        page.innerHTML = `
            <div class="login-container">
                <div class="text-center mb-8">
                    <div class="login-logo">
                        ${Icons.recycle('icon')}
                    </div>
                    <h1 class="login-title">EcoResi Admin</h1>
                    <p class="login-subtitle">Panel de Administración</p>
                </div>
                
                <div class="card login-card">
                    <div class="card-header">
                        <h3 class="card-title">Bienvenido</h3>
                        <p class="card-description">Accede al panel de administración de reportes</p>
                    </div>
                    <div class="card-content">
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label" for="email">Correo electrónico</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    class="form-input" 
                                    placeholder="admin@ecoresi.com"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="password">Contraseña</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    class="form-input" 
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">
                                Iniciar Sesión
                            </button>
                        </form>
                    </div>
                </div>
                
                <p class="login-footer">© 2025 EcoResi. Todos los derechos reservados.</p>
            </div>
        `;

        // Add form submit handler
        const form = page.querySelector('#loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;

            try {
                btnSubmit.disabled = true;
                btnSubmit.innerText = "Iniciando sesión...";

                const response = await fetch(`${CONFIG.API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar token y usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    this.onLogin();
                } else {
                    throw new Error(data.message || "Error al iniciar sesión");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert(error.message);
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerText = originalText;
            }
        });

        return page;
    }
}
