const CONFIG = {
    API_URL: 'https://segnite-team.onrender.com/api/v1',
    /**
     * Obtiene la API key desde el backend para evitar exponerla en el frontend
     */
    getGoogleMapsApiKey: async () => {
        const response = await fetch(`${CONFIG.API_URL}/config/google-maps-key`);
        const data = await response.json();
        if (!data.success || !data.apiKey) {
            throw new Error('No se pudo obtener la API key de Google Maps');
        }
        return data.apiKey;
    }
};
