const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./config/database');

// Importar middlewares
const errorHandler = require('./middlewares/errorHandler.middleware');

// Importar rutas
const userRoutes = require('./routes/user.routes');
const reporteRoutes = require('./routes/reporte.routes');
const configRoutes = require('./routes/config.routes');

const app = express();

// Middlewares de seguridad y utilidad
// Permitimos cargar recursos est�ticos (im�genes) desde otros or�genes para el panel admin.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
})); // Seguridad HTTP headers
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(morgan('dev')); // Logging de peticiones
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta de readiness check (DB conectada)
app.get('/ready', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({
            status: 'READY',
            database: 'CONNECTED',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'NOT READY',
            database: 'DISCONNECTED',
            error: error.message
        });
    }
});

// Rutas de la API
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/reportes`, reporteRoutes);
app.use(`${API_PREFIX}/config`, configRoutes); // Ruta para configuración (API keys)

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
