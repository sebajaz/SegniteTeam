const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre es requerido' },
            len: {
                args: [1, 50],
                msg: 'El nombre no puede exceder 50 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'El email ya está registrado'
        },
        validate: {
            notEmpty: { msg: 'El email es requerido' },
            isEmail: { msg: 'Debe ser un email válido' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La contraseña es requerida' },
            len: {
                args: [6, 100],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    rol: {
        type: DataTypes.ENUM('admin'),
        defaultValue: 'admin',
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'usuarios',
    timestamps: true, // createdAt, updatedAt
    hooks: {
        // Hook para hashear password antes de crear
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hook para hashear password antes de actualizar
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Método de instancia para comparar passwords
User.prototype.compararPassword = async function (passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para obtener datos públicos (sin password)
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

module.exports = User;
