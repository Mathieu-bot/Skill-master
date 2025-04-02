import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

class AuthService {
    constructor() {
        this.tokenRefreshInterval = null;
        this.setupTokenRefresh();
    }

    async refreshToken() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            try {
                const response = await axios.post(API_URL + 'refresh-token', {}, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.data.token) {
                    user.token = response.data.token;
                    localStorage.setItem('user', JSON.stringify(user));
                    this.setAuthHeader(response.data.token);
                    return true;
                }
            } catch (error) {
                console.error('Erreur lors du rafraîchissement du token:', error);
                if (error.response?.status === 401) {
                    this.logout();
                }
                return false;
            }
        }
        return false;
    }

    setupTokenRefresh() {
        // Vérifier et rafraîchir le token toutes les 14 minutes (le token expire après 15 minutes)
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        // Rafraîchir immédiatement le token au démarrage
        this.refreshToken();

        // Puis configurer l'intervalle de rafraîchissement
        this.tokenRefreshInterval = setInterval(async () => {
            const user = this.getCurrentUser();
            if (user && user.token) {
                try {
                    const response = await axios.post(API_URL + 'refresh-token', {}, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    if (response.data.token) {
                        user.token = response.data.token;
                        sessionStorage.setItem('user', JSON.stringify(user));
                        this.setAuthHeader(response.data.token);
                    }
                } catch (error) {
                    console.error('Erreur lors du rafraîchissement du token:', error);
                    if (error.response?.status === 401) {
                        this.logout();
                    }
                }
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    async login(email, password) {
        const response = await axios.post(API_URL + 'login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            this.setAuthHeader(response.data.token);
            this.setupTokenRefresh();
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
            this.tokenRefreshInterval = null;
        }
    }

    async register(name, email, password) {
        const response = await axios.post(API_URL + 'register', {
            name,
            email,
            password
        });
        return response.data;
    }

    async forgotPassword(email) {
        const response = await axios.post(API_URL + 'forgot-password', { email });
        return response.data;
    }

    async resetPassword(token, password) {
        const response = await axios.post(API_URL + 'reset-password', {
            token,
            password
        });
        return response.data;
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        console.log('User string from storage:', userStr);
        if (!userStr) return null;

        try {
            const user = JSON.parse(userStr);
            console.log('User parsed:', user);
            // Vérifier si le token est expiré
            if (user.token) {
                const tokenData = JSON.parse(atob(user.token.split('.')[1]));
                if (tokenData.exp * 1000 < Date.now()) {
                    this.logout();
                    return null;
                }
            }
            return user;
        } catch (error) {
            console.error('Erreur lors de la lecture des données utilisateur:', error);
            this.logout();
            return null;
        }
    }

    setAuthHeader(token) {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    isLoggedIn() {
        const user = this.getCurrentUser();
        return !!user && !!user.token;
    }
}

export default new AuthService();