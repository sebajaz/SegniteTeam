const bcrypt = require('bcryptjs');

// Script para generar hash de password para usuario admin
const password = process.argv[2] || 'admin321!';

bcrypt.hash(password, 10).then(hash => {
    console.log('\n===========================================');
    console.log('PASSWORD HASHEADO PARA USUARIO ADMIN');
    console.log('===========================================\n');
    console.log('Password original:', password);
    console.log('Password hasheado:', hash);
    console.log('\n===========================================');
    console.log('SQL para insertar usuario admin:');
    console.log('===========================================\n');
    console.log(`INSERT INTO usuarios (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@ecoresi.com',
  '${hash}',
  'admin',
  true,
  NOW(),
  NOW()
);`);
    console.log('\n===========================================\n');
    process.exit(0);
}).catch(err => {
    console.error('Error al hashear password:', err);
    process.exit(1);
});
