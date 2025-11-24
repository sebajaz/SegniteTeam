const Reporte = require('../models/reporte.model');
const { Op } = require('sequelize');

class ReporteRepository {
    /**
     * Crear un nuevo reporte (anónimo)
     */
    async create(reporteData) {
        try {
            return await Reporte.create(reporteData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los reportes con filtros
     */
    async findAll(filters = {}, page = 1, limit = 50) {
        try {
            const offset = (page - 1) * limit;
            const where = {};

            // Filtro por estado
            if (filters.estado) {
                where.estado = filters.estado;
            }

            // Filtro por zona afectada
            if (filters.esZonaAfectada !== undefined) {
                where.esZonaAfectada = filters.esZonaAfectada;
            }

            // Filtro por rango de fechas
            if (filters.fechaDesde || filters.fechaHasta) {
                where.fechaReporte = {};
                if (filters.fechaDesde) {
                    where.fechaReporte[Op.gte] = filters.fechaDesde;
                }
                if (filters.fechaHasta) {
                    where.fechaReporte[Op.lte] = filters.fechaHasta;
                }
            }

            const { count, rows } = await Reporte.findAndCountAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                reportes: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar reporte por ID
     */
    async findById(id) {
        try {
            return await Reporte.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar estado del reporte
     */
    async updateEstado(id, estado) {
        try {
            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return null;
            }

            reporte.estado = estado;
            await reporte.save();
            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar campo esZonaAfectada
     */
    async updateZonaAfectada(id, esZonaAfectada) {
        try {
            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return null;
            }

            reporte.esZonaAfectada = esZonaAfectada;
            await reporte.save();
            return reporte;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los reportes (sin paginación) para cálculos de zonas
     */
    async findAllForGeoCalculation(estado = null) {
        try {
            const where = {};
            if (estado) {
                where.estado = estado;
            }

            return await Reporte.findAll({
                where,
                attributes: ['id', 'latitud', 'longitud', 'estado', 'esZonaAfectada', 'direccion', 'fechaReporte'],
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Contar reportes por estado
     */
    async countByEstado() {
        try {
            const pendientes = await Reporte.count({ where: { estado: 'pendiente' } });
            const aprobados = await Reporte.count({ where: { estado: 'aprobado' } });
            const rechazados = await Reporte.count({ where: { estado: 'rechazado' } });

            return {
                pendientes,
                aprobados,
                rechazados,
                total: pendientes + aprobados + rechazados
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Contar reportes en zonas afectadas
     */
    async countZonasAfectadas() {
        try {
            return await Reporte.count({ where: { esZonaAfectada: true } });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar un reporte por ID
     */
    async deleteById(id) {
        try {
            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return null;
            }

            await reporte.destroy();
            return reporte;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReporteRepository();
