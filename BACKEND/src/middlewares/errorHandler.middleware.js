/**
 * Middleware global de manejo de errores
 * Debe ser el último middleware en app.js
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors
        });
    }

    // Error de duplicado (MongoDB)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `El ${field} ya está registrado`
        });
    }

    // Error de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID inválido'
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }

    // Errores personalizados
    if (err.message) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Error genérico
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
};

module.exports = errorHandler;
