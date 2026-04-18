import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jofranck14-app-agence-production.up.railway.app/', // Remplace par ton port backend
});

// Ce code ajoute le token automatiquement dans le header avant chaque requête
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si le backend dit "Token invalide" (401)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // On le déconnecte de force
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;