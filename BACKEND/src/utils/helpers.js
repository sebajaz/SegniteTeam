/**
 * Funciones de ayuda generales
 */

/**
 * Formatear respuesta exitosa
 */
const successResponse = (data, message = 'Operación exitosa') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Formatear respuesta de error
 */
const errorResponse = (message = 'Error en la operación', errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return response;
};

/**
 * Validar ObjectId de MongoDB
 */
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitizar objeto removiendo campos undefined o null
 */
const sanitizeObject = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== undefined && obj[key] !== null) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};

/**
 * Generar código aleatorio
 */
const generateRandomCode = (length = 6) => {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

module.exports = {
    successResponse,
    errorResponse,
    isValidObjectId,
    sanitizeObject,
    generateRandomCode
};
