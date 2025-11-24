require('dotenv').config();
const { sequelize } = require('../src/config/database');
const User = require('../src/models/user.model');

const ADMIN_EMAIL = 'admin@ecoresi.com';
const ADMIN_PASSWORD = 'admin321!';
const ADMIN_NAME = 'Administrador';

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log('DB conectada con exito');

        // Garantiza que la tabla exista sin alterar la estructura
        await sequelize.sync();

        const existingUser = await User.findOne({ where: { email: ADMIN_EMAIL } });

        if (existingUser) {
            await existingUser.update({
                nombre: ADMIN_NAME,
                password: ADMIN_PASSWORD,
                rol: 'admin',
                activo: true
            });
            console.log('Usuario admin encontrado: datos sincronizados y password regenerada');
        } else {
            await User.create({
                nombre: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                rol: 'admin',
                activo: true
            });
            console.log('Usuario admin creado exitosamente');
        }
    } catch (error) {
        console.error('Error al crear/actualizar usuario admin:', error);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

seedAdmin();
