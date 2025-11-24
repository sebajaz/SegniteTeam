const User = require('../models/user.model');

class UserRepository {
    /**
     * Crear un nuevo usuario (admin)
     */
    async create(userData) {
        try {
            return await User.create(userData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por ID
     */
    async findById(id) {
        try {
            return await User.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por email (incluye password)
     */
    async findByEmail(email) {
        try {
            return await User.findOne({ where: { email } });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar si existe un email
     */
    async emailExists(email) {
        try {
            const user = await User.findOne({ where: { email } });
            return !!user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los usuarios
     */
    async findAll() {
        try {
            return await User.findAll({
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualizar usuario
     */
    async update(id, updateData) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }

            await user.update(updateData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar usuario (soft delete)
     */
    async delete(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }

            user.activo = false;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
