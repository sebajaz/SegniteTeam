-- ================================================
-- Script SQL para Crear Tablas en PostgreSQL Render
-- Base de datos: ecoresi
-- ================================================

-- 0. HABILITAR EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CREAR TABLA DE USUARIOS (solo admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(10) NOT NULL DEFAULT 'admin' CHECK (rol = 'admin'),
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. CREAR TABLA DE REPORTES
CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direccion VARCHAR(255),
  latitud DECIMAL(10, 8) NOT NULL CHECK (latitud >= -90 AND latitud <= 90),
  longitud DECIMAL(11, 8) NOT NULL CHECK (longitud >= -180 AND longitud <= 180),
  comentario TEXT NOT NULL,
  "imagenUrl" VARCHAR(500),
  "fechaReporte" DATE NOT NULL DEFAULT CURRENT_DATE,
  "horaReporte" TIME NOT NULL DEFAULT CURRENT_TIME,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  "esZonaAfectada" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. CREAR INDICES PARA OPTIMIZAR CONSULTAS
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_coords ON reportes(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes("fechaReporte");
CREATE INDEX IF NOT EXISTS idx_reportes_zona ON reportes("esZonaAfectada");
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- 4. INSERTAR USUARIO ADMINISTRADOR
-- Password: admin321! (se hashea con bcrypt usando pgcrypto)
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

-- 5. VERIFICAR QUE SE CREARON LAS TABLAS
\dt

-- 6. VERIFICAR USUARIO ADMIN
SELECT id, nombre, email, rol, activo, "createdAt"
FROM usuarios
WHERE email = 'admin@ecoresi.com';

-- 7. VERIFICAR ESTRUCTURA DE TABLAS
\d usuarios
\d reportes

-- ================================================
-- COMANDOS UTILES
-- ================================================

-- Ver todas las tablas
-- \dt

-- Ver estructura de una tabla
-- \d nombre_tabla

-- Contar registros
-- SELECT COUNT(*) FROM usuarios;
-- SELECT COUNT(*) FROM reportes;

-- Ver reportes por estado
-- SELECT estado, COUNT(*) FROM reportes GROUP BY estado;

-- Salir de psql
-- \q
