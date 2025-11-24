const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

class AuthMiddleware {
    /**
     * Verificar token JWT
     */
    async verificarToken(req, res, next) {
        try {
            // Obtener token del header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'No se proporcionó token de autenticación'
                });
            }

            const token = authHeader.substring(7); // Remover 'Bearer '

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar usuario
            const user = await userRepository.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            if (!user.activo) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo'
                });
            }

            // Agregar usuario a la request
            req.user = {
                id: user._id,
                email: user.email,
                rol: user.rol
            };

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido'
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado'
                });
            }

            next(error);
        }
    }

    /**
     * Verificar rol del usuario
     */
    verificarRol(rolesPermitidos) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            if (!rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para realizar esta acción'
                });
            }

            next();
        };
    }
}

module.exports = new AuthMiddleware();
