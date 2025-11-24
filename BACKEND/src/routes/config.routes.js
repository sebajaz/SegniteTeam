const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/config/google-maps-key
 * Endpoint para obtener la API key de Google Maps de forma segura
 * La key está en el backend y no se expone en el código del frontend
 */
router.get('/google-maps-key', (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Google Maps API key no configurada en el servidor'
            });
        }

        res.json({
            success: true,
            apiKey: apiKey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la API key'
        });
    }
});

module.exports = router;
