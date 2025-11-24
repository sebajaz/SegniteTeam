const { Sequelize } = require('sequelize');

console.log('🔍 Probando conexión a PostgreSQL de Render...\n');

// Mostrar configuración
console.log('📋 Configuración:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ Configurada' : '❌ No configurada');
console.log('');

// Intentar conexión
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log
});

async function testConnection() {
    try {
        console.log('🔌 Intentando conectar...\n');
        await sequelize.authenticate();
        console.log('\n✅ ¡Conexión exitosa a PostgreSQL!');

        // Probar query simple
        const [results] = await sequelize.query('SELECT NOW() as current_time');
        console.log('⏰ Hora del servidor:', results[0].current_time);

        // Listar tablas
        const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('\n📊 Tablas existentes:', tables.length);
        tables.forEach(t => console.log('  -', t.table_name));

        await sequelize.close();
        console.log('\n✅ Prueba completada exitosamente');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error al conectar:');
        console.error('  Tipo:', error.name);
        console.error('  Mensaje:', error.message);
        console.error('  Código:', error.code || 'N/A');

        if (error.message.includes('ECONNRESET')) {
            console.log('\n💡 Posibles soluciones:');
            console.log('  1. Verifica tu conexión a internet');
            console.log('  2. Verifica que el firewall no bloquee la conexión');
            console.log('  3. Intenta desde otra red (ej: datos móviles)');
            console.log('  4. Verifica que las credenciales en .env sean correctas');
            console.log('  5. Verifica que la base de datos en Render esté activa');
        }

        process.exit(1);
    }
}

testConnection();
