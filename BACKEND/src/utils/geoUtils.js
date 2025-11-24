/**
 * Utilidades para cálculos geoespaciales
 */

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} Distancia en metros
 */
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radio de la Tierra en metros

    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
};

/**
 * Obtiene reportes dentro de un radio específico de una coordenada
 * @param {Array} reportes - Array de reportes con latitud y longitud
 * @param {number} latitud - Latitud del punto central
 * @param {number} longitud - Longitud del punto central
 * @param {number} radio - Radio en metros (default: 100)
 * @returns {Array} Reportes dentro del radio
 */
const obtenerReportesEnRadio = (reportes, latitud, longitud, radio = 100) => {
    return reportes.filter(reporte => {
        const distancia = calcularDistancia(
            latitud,
            longitud,
            parseFloat(reporte.latitud),
            parseFloat(reporte.longitud)
        );
        return distancia <= radio;
    });
};

/**
 * Detecta zonas afectadas (3 o más reportes en un radio de 100m)
 * @param {Array} reportes - Array de todos los reportes
 * @param {number} radio - Radio en metros (default: 100)
 * @param {number} minReportes - Mínimo de reportes para considerar zona afectada (default: 3)
 * @returns {Array} Array de reportes que están en zonas afectadas
 */
const detectarZonasAfectadas = (reportes, radio = 100, minReportes = 3) => {
    const reportesEnZonaAfectada = [];
    const procesados = new Set();

    reportes.forEach((reporte, index) => {
        if (procesados.has(reporte.id)) return;

        // Buscar reportes cercanos
        const reportesCercanos = obtenerReportesEnRadio(
            reportes,
            parseFloat(reporte.latitud),
            parseFloat(reporte.longitud),
            radio
        );

        // Si hay 3 o más reportes en el radio, marcar como zona afectada
        if (reportesCercanos.length >= minReportes) {
            reportesCercanos.forEach(r => {
                if (!procesados.has(r.id)) {
                    reportesEnZonaAfectada.push(r);
                    procesados.add(r.id);
                }
            });
        }
    });

    return reportesEnZonaAfectada;
};

/**
 * Agrupa reportes por clusters de proximidad
 * @param {Array} reportes - Array de reportes
 * @param {number} radio - Radio en metros para agrupar
 * @returns {Array} Array de clusters con sus reportes
 */
const agruparPorProximidad = (reportes, radio = 100) => {
    const clusters = [];
    const procesados = new Set();

    reportes.forEach(reporte => {
        if (procesados.has(reporte.id)) return;

        const reportesCercanos = obtenerReportesEnRadio(
            reportes,
            parseFloat(reporte.latitud),
            parseFloat(reporte.longitud),
            radio
        );

        if (reportesCercanos.length > 0) {
            // Calcular centro del cluster (promedio de coordenadas)
            const latPromedio = reportesCercanos.reduce((sum, r) => sum + parseFloat(r.latitud), 0) / reportesCercanos.length;
            const lonPromedio = reportesCercanos.reduce((sum, r) => sum + parseFloat(r.longitud), 0) / reportesCercanos.length;

            clusters.push({
                centro: {
                    latitud: latPromedio,
                    longitud: lonPromedio
                },
                cantidadReportes: reportesCercanos.length,
                reportes: reportesCercanos,
                esZonaAfectada: reportesCercanos.length >= 3
            });

            reportesCercanos.forEach(r => procesados.add(r.id));
        }
    });

    return clusters;
};

module.exports = {
    calcularDistancia,
    obtenerReportesEnRadio,
    detectarZonasAfectadas,
    agruparPorProximidad
};
