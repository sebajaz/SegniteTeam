const { Sequelize } = require('sequelize');

// Configurar Sequelize con PostgreSQL
// Render proporciona DATABASE_URL automáticamente
const sequelize = new Sequelize(process.env.DATABASE_URL || {
    database: process.env.DB_NAME || 'ecoresi',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Necesario para Render y otras plataformas cloud
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL conectado exitosamente');

        // Sincronizar modelos (crear tablas si no existen)
        // En producción, usar migraciones en lugar de sync
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados con la base de datos');
        }

    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
