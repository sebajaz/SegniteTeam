const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validaciones
const validacionRegistro = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telefono')
        .optional()
        .trim(),
    body('direccion')
        .optional()
        .trim(),
    body('rol')
        .optional()
        .isIn(['usuario', 'admin', 'recolector']).withMessage('Rol inválido')
];

const validacionLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
];

const validacionActualizacion = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('telefono')
        .optional()
        .trim(),
    body('direccion')
        .optional()
        .trim(),
    body('rol')
        .optional()
        .isIn(['usuario', 'admin', 'recolector']).withMessage('Rol inválido')
];

// Rutas públicas
router.post('/register', validacionRegistro, userController.registrar);
router.post('/login', validacionLogin, userController.login);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', authMiddleware.verificarToken, userController.obtenerPerfil);

// Rutas de administración (requieren autenticación y rol admin)
router.get('/',
    authMiddleware.verificarToken,
    authMiddleware.verificarRol(['admin']),
    userController.obtenerTodos
);

router.get('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarRol(['admin']),
    userController.obtenerPorId
);

router.put('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarRol(['admin']),
    validacionActualizacion,
    userController.actualizar
);

router.delete('/:id',
    authMiddleware.verificarToken,
    authMiddleware.verificarRol(['admin']),
    userController.eliminar
);

module.exports = router;
