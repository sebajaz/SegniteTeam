const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

class UserController {
    /**
     * Registrar nuevo usuario
     * POST /api/v1/users/register
     */
    async registrar(req, res, next) {
        try {
            // Validar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { nombre, email, password, telefono, direccion, rol } = req.body;

            const resultado = await userService.registrarUsuario({
                nombre,
                email,
                password,
                telefono,
                direccion,
                rol
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Iniciar sesión
     * POST /api/v1/users/login
     */
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            const resultado = await userService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     * GET /api/v1/users/perfil
     */
    async obtenerPerfil(req, res, next) {
        try {
            const user = await userService.obtenerUsuarioPorId(req.user.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener todos los usuarios (solo admin)
     * GET /api/v1/users
     */
    async obtenerTodos(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {};

            // Filtros opcionales
            if (req.query.rol) {
                filters.rol = req.query.rol;
            }
            if (req.query.activo !== undefined) {
                filters.activo = req.query.activo === 'true';
            }

            const resultado = await userService.obtenerUsuarios(page, limit, filters);

            res.status(200).json({
                success: true,
                data: resultado.users,
                pagination: resultado.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener usuario por ID
     * GET /api/v1/users/:id
     */
    async obtenerPorId(req, res, next) {
        try {
            const user = await userService.obtenerUsuarioPorId(req.params.id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualizar usuario
     * PUT /api/v1/users/:id
     */
    async actualizar(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const user = await userService.actualizarUsuario(req.params.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Eliminar usuario (soft delete)
     * DELETE /api/v1/users/:id
     */
    async eliminar(req, res, next) {
        try {
            await userService.eliminarUsuario(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
