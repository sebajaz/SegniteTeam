const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reporte = sequelize.define('Reporte', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Dirección textual del reporte'
    },
    latitud: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
            min: -90,
            max: 90,
            notNull: { msg: 'La latitud es requerida' }
        },
        comment: 'Latitud de la ubicación'
    },
    longitud: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
            min: -180,
            max: 180,
            notNull: { msg: 'La longitud es requerida' }
        },
        comment: 'Longitud de la ubicación'
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El comentario es requerido' }
        }
    },
    imagenUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL de la imagen subida (Cloudinary o local)'
    },
    fechaReporte: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha del reporte'
    },
    horaReporte: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Hora del reporte'
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
        defaultValue: 'pendiente',
        allowNull: false
    },
    esZonaAfectada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indica si está en una zona con 3+ reportes en 100m'
    }
}, {
    tableName: 'reportes',
    timestamps: true, // createdAt, updatedAt
    indexes: [
        {
            fields: ['estado']
        },
        {
            fields: ['latitud', 'longitud']
        },
        {
            fields: ['fechaReporte']
        },
        {
            fields: ['esZonaAfectada']
        }
    ]
});

module.exports = Reporte;
