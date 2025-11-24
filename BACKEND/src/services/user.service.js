const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');

class UserService {
    /**
     * Login de admin
     */
    async login(email, password) {
        try {
            // Buscar usuario por email
            const user = await userRepository.findByEmail(email);

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar si el usuario está activo
            if (!user.activo) {
                throw new Error('Usuario inactivo');
            }

            // Verificar que sea admin
            if (user.rol !== 'admin') {
                throw new Error('Acceso denegado');
            }

            // Verificar password
            const passwordValido = await user.compararPassword(password);

            if (!passwordValido) {
                throw new Error('Credenciales inválidas');
            }

            // Generar token
            const token = this.generarToken(user.id);

            // Remover password del objeto
            const userData = user.toJSON();

            return {
                user: userData,
                token
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generar token JWT
     */
    generarToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    /**
     * Verificar token JWT
     */
    verificarToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports = new UserService();
