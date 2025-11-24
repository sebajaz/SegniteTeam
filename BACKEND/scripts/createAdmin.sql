-- Script SQL para crear usuario administrador en Render
-- Password configurada: admin321!

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO usuarios (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@ecoresi.com',
  crypt('admin321!', gen_salt('bf')),
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificacion rapida
SELECT id, nombre, email, rol, activo, "createdAt"
FROM usuarios
WHERE email = 'admin@ecoresi.com';
