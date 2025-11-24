const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { body } = require('express-validator');

// Validaciones para crear reporte
const validacionCrearReporte = [
    body('latitud')
        .notEmpty().withMessage('La latitud es requerida')
        .isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
    body('longitud')
        .notEmpty().withMessage('La longitud es requerida')
        .isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
    body('comentario')
        .notEmpty().withMessage('El comentario es requerido')
        .trim(),
    body('direccion')
        .optional()
        .trim()
];

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

/**
 * POST /api/v1/reportes
 * Crear reporte anónimo con imagen
 */
router.post('/',
    upload.single('imagen'), // Campo 'imagen' en el form-data
    validacionCrearReporte,
    reporteController.crearReporte
);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación ADMIN)
// ============================================

/**
 * GET /api/v1/reportes/estadisticas
 * Obtener estadísticas generales
 * IMPORTANTE: Esta ruta debe ir ANTES de /:id para evitar conflictos
 */
router.get('/estadisticas',
    authMiddleware.verificarToken,
    reporteController.obtenerEstadisticas
);

/**
 * GET /api/v1/reportes/zonas-afectadas
 * Obtener zonas con 3+ reportes en 100m
 */
router.get('/zonas-afectadas',
    authMiddleware.verificarToken,
    reporteController.obtenerZonasAfectadas
);

/**
 * POST /api/v1/reportes/recalcular-zonas
 * Recalcular zonas afectadas manualmente
 */
router.post('/recalcular-zonas',
    authMiddleware.verificarToken,
    reporteController.recalcularZonas
);

/**
 * GET /api/v1/reportes
 * Listar todos los reportes con filtros
 */
router.get('/',
    authMiddleware.verificarToken,
    reporteController.obtenerReportes
);

/**
 * GET /api/v1/reportes/:id
 * Obtener reporte por ID
 */
router.get('/:id',
    authMiddleware.verificarToken,
    reporteController.obtenerReportePorId
);

/**
 * PUT /api/v1/reportes/:id/aprobar
 * Aprobar reporte
 */
router.put('/:id/aprobar',
    authMiddleware.verificarToken,
    reporteController.aprobarReporte
);

/**
 * PUT /api/v1/reportes/:id/rechazar
 * Rechazar reporte
 */
router.put('/:id/rechazar',
    authMiddleware.verificarToken,
    reporteController.rechazarReporte
);

module.exports = router;
