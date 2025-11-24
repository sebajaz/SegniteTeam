// Main Application
class App {
    constructor() {
        this.isLoggedIn = false;
        this.currentPage = null;
    }

    handleLogin() {
        this.isLoggedIn = true;
        this.render();
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.render();
    }

    render() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';

        if (this.isLoggedIn) {
            const adminPanel = new AdminPanel(() => this.handleLogout());
            this.currentPage = adminPanel.render();
        } else {
            const loginPage = new LoginPage(() => this.handleLogin());
            this.currentPage = loginPage.render();
        }

        appContainer.appendChild(this.currentPage);
    }

    init() {
        this.render();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
