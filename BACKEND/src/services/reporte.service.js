const reporteRepository = require('../repositories/reporte.repository');
const { detectarZonasAfectadas, agruparPorProximidad } = require('../utils/geoUtils');

class ReporteService {
    /**
     * Crear un nuevo reporte (anónimo, sin autenticación)
     */
    async crearReporte(reporteData) {
        try {
            // Crear el reporte
            const reporte = await reporteRepository.create({
                ...reporteData,
                fechaReporte: new Date(),
                horaReporte: new Date().toTimeString().split(' ')[0], // HH:MM:SS
                estado: 'pendiente',
                esZonaAfectada: false
            });

            // Después de crear, recalcular zonas afectadas
            await this.recalcularZonasAfectadas();

            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener reportes con filtros (solo admin)
     */
    async obtenerReportes(filters = {}, page = 1, limit = 50) {
        try {
            return await reporteRepository.findAll(filters, page, limit);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener reporte por ID
     */
    async obtenerReportePorId(id) {
        try {
            const reporte = await reporteRepository.findById(id);
            if (!reporte) {
                throw new Error('Reporte no encontrado');
            }
            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Aprobar reporte (solo admin)
     */
    async aprobarReporte(id) {
        try {
            const reporte = await reporteRepository.updateEstado(id, 'aprobado');
            if (!reporte) {
                throw new Error('Reporte no encontrado');
            }
            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Rechazar reporte (solo admin)
     */
    async rechazarReporte(id) {
        try {
            const reporte = await reporteRepository.updateEstado(id, 'rechazado');
            if (!reporte) {
                throw new Error('Reporte no encontrado');
            }
            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Recalcular zonas afectadas para todos los reportes
     */
    async recalcularZonasAfectadas() {
        try {
            // Obtener todos los reportes pendientes y aprobados
            const reportes = await reporteRepository.findAllForGeoCalculation();

            // Detectar cuáles están en zonas afectadas (3+ reportes en 100m)
            const reportesEnZonaAfectada = detectarZonasAfectadas(reportes, 100, 3);
            const idsEnZonaAfectada = new Set(reportesEnZonaAfectada.map(r => r.id));

            // Actualizar todos los reportes
            for (const reporte of reportes) {
                const debeSerZonaAfectada = idsEnZonaAfectada.has(reporte.id);
                if (reporte.esZonaAfectada !== debeSerZonaAfectada) {
                    await reporteRepository.updateZonaAfectada(reporte.id, debeSerZonaAfectada);
                }
            }

            return {
                totalReportes: reportes.length,
                reportesEnZonaAfectada: reportesEnZonaAfectada.length
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener zonas afectadas agrupadas
     */
    async obtenerZonasAfectadas() {
        try {
            const reportes = await reporteRepository.findAllForGeoCalculation();
            const clusters = agruparPorProximidad(reportes, 100);

            // Filtrar solo los clusters que son zonas afectadas (3+ reportes)
            const zonasAfectadas = clusters.filter(cluster => cluster.esZonaAfectada);

            return zonasAfectadas.map(zona => ({
                centro: zona.centro,
                cantidadReportes: zona.cantidadReportes,
                reportes: zona.reportes.map(r => ({
                    id: r.id,
                    direccion: r.direccion,
                    latitud: r.latitud,
                    longitud: r.longitud,
                    estado: r.estado,
                    fechaReporte: r.fechaReporte
                }))
            }));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener estadísticas generales
     */
    async obtenerEstadisticas() {
        try {
            const porEstado = await reporteRepository.countByEstado();
            const zonasAfectadas = await reporteRepository.countZonasAfectadas();

            return {
                ...porEstado,
                reportesEnZonasAfectadas: zonasAfectadas
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReporteService();
