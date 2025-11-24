const reporteService = require('../services/reporte.service');
const { validationResult } = require('express-validator');

/**
 * Construye una URL p�blica para la imagen almacenada en /uploads.
 * Se normaliza el path por si viene con rutas absolutas o backslashes.
 */
function buildPublicImageUrl(req, imagenUrl) {
    if (!imagenUrl) return null;

    // Normalizar separadores
    const normalized = imagenUrl.replace(/\\/g, '/');

    // Obtener la parte relativa a /uploads
    let relativePath = normalized;
    const uploadsIndex = normalized.indexOf('/uploads/');
    const uploadsIndexNoSlash = normalized.indexOf('uploads/');

    if (uploadsIndex !== -1) {
        relativePath = normalized.slice(uploadsIndex);
    } else if (uploadsIndexNoSlash !== -1) {
        relativePath = '/' + normalized.slice(uploadsIndexNoSlash);
    }

    if (!relativePath.startsWith('/')) {
        relativePath = '/' + relativePath;
    }

    // Detectar protocolo real si estamos detr�s de un proxy
    const protoHeader = req.headers['x-forwarded-proto'];
    const protocol = protoHeader ? protoHeader.split(',')[0] : req.protocol;
    const host = req.get('host');

    return `${protocol}://${host}${relativePath}`;
}

class ReporteController {
    /**
     * Crear nuevo reporte (PÚBLICO - sin autenticación)
     * POST /api/v1/reportes
     */
    async crearReporte(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { direccion, latitud, longitud, comentario } = req.body;

            // Imagen subida (si existe)
            const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

            const reporte = await reporteService.crearReporte({
                direccion,
                latitud: parseFloat(latitud),
                longitud: parseFloat(longitud),
                comentario,
                imagenUrl
            });

            res.status(201).json({
                success: true,
                message: 'Reporte creado exitosamente',
                data: {
                    ...reporte.toJSON(),
                    imagenUrlPublica: buildPublicImageUrl(req, imagenUrl)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener todos los reportes con filtros (ADMIN)
     * GET /api/v1/reportes
     */
    async obtenerReportes(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;

            const filters = {};
            if (req.query.estado) {
                filters.estado = req.query.estado;
            }
            if (req.query.esZonaAfectada !== undefined) {
                filters.esZonaAfectada = req.query.esZonaAfectada === 'true';
            }
            if (req.query.fechaDesde) {
                filters.fechaDesde = req.query.fechaDesde;
            }
            if (req.query.fechaHasta) {
                filters.fechaHasta = req.query.fechaHasta;
            }

            const resultado = await reporteService.obtenerReportes(filters, page, limit);

            const reportesConImagen = resultado.reportes.map((r) => ({
                ...r.toJSON(),
                imagenUrlPublica: buildPublicImageUrl(req, r.imagenUrl)
            }));

            res.status(200).json({
                success: true,
                data: reportesConImagen,
                pagination: resultado.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener reporte por ID (ADMIN)
     * GET /api/v1/reportes/:id
     */
    async obtenerReportePorId(req, res, next) {
        try {
            const reporte = await reporteService.obtenerReportePorId(req.params.id);

            res.status(200).json({
                success: true,
                data: {
                    ...reporte.toJSON(),
                    imagenUrlPublica: buildPublicImageUrl(req, reporte.imagenUrl)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Aprobar reporte (ADMIN)
     * PUT /api/v1/reportes/:id/aprobar
     */
    async aprobarReporte(req, res, next) {
        try {
            const reporte = await reporteService.aprobarReporte(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Reporte aprobado exitosamente',
                data: reporte
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Rechazar reporte (ADMIN)
     * PUT /api/v1/reportes/:id/rechazar
     */
    async rechazarReporte(req, res, next) {
        try {
            const reporte = await reporteService.rechazarReporte(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Reporte rechazado exitosamente',
                data: reporte
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener zonas afectadas (ADMIN)
     * GET /api/v1/reportes/zonas-afectadas
     */
    async obtenerZonasAfectadas(req, res, next) {
        try {
            const zonas = await reporteService.obtenerZonasAfectadas();

            res.status(200).json({
                success: true,
                data: zonas
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener estadísticas (ADMIN)
     * GET /api/v1/reportes/estadisticas
     */
    async obtenerEstadisticas(req, res, next) {
        try {
            const estadisticas = await reporteService.obtenerEstadisticas();

            res.status(200).json({
                success: true,
                data: estadisticas
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Recalcular zonas afectadas manualmente (ADMIN)
     * POST /api/v1/reportes/recalcular-zonas
     */
    async recalcularZonas(req, res, next) {
        try {
            const resultado = await reporteService.recalcularZonasAfectadas();

            res.status(200).json({
                success: true,
                message: 'Zonas afectadas recalculadas exitosamente',
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReporteController();
