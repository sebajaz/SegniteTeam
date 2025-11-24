# Crear Tablas en PostgreSQL de Render

## 🎯 Objetivo
Crear las tablas `usuarios` y `reportes` en la base de datos PostgreSQL de Render.

---

## ✅ Método 1: Sincronización Automática (Recomendado)

Sequelize puede crear las tablas automáticamente cuando el servidor inicia.

### Paso 1: Cambiar NODE_ENV Temporalmente

En Render, ve a tu **Web Service** → **Environment**:

**Cambiar:**
```
NODE_ENV=production
```

**Por:**
```
NODE_ENV=development
```

### Paso 2: Hacer Deploy

1. Guarda los cambios en Environment
2. Render hará un nuevo deploy automáticamente
3. Espera a que el deploy termine (2-5 minutos)

### Paso 3: Verificar en los Logs

En **Logs**, deberías ver:
```
✅ PostgreSQL conectado exitosamente
✅ Modelos sincronizados con la base de datos
```

Esto significa que las tablas se crearon correctamente.

### Paso 4: Volver a Producción

Una vez creadas las tablas, vuelve a cambiar:
```
NODE_ENV=production
```

---

## ✅ Método 2: Conectarse Manualmente (Alternativa)

Si prefieres crear las tablas manualmente:

### Conectarse a PostgreSQL

```bash
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi
```

### SQL para Crear Tablas

```sql
-- Tabla de usuarios (solo admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(10) NOT NULL DEFAULT 'admin',
  activo BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direccion VARCHAR(255),
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  comentario TEXT NOT NULL,
  "imagenUrl" VARCHAR(500),
  "fechaReporte" DATE NOT NULL DEFAULT CURRENT_DATE,
  "horaReporte" TIME NOT NULL DEFAULT CURRENT_TIME,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  "esZonaAfectada" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_coords ON reportes(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes("fechaReporte");
CREATE INDEX IF NOT EXISTS idx_reportes_zona ON reportes("esZonaAfectada");

-- Verificar que se crearon
\dt
```

---

## 👤 Crear Usuario Administrador

Una vez que las tablas existan, crea el usuario admin:

```sql
INSERT INTO usuarios (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@ecoresi.com',
  '$2a$10$xs8OU1Fq7kPKrvzZvgVLW.TzKGZuuCOUO8PHD24MfysXVU8g0MGKK',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar
SELECT id, nombre, email, rol, activo FROM usuarios;
```

**Credenciales del admin:**
- Email: `admin@ecoresi.com`
- Password: `admin123`

---

## 🔍 Verificar que Todo Funciona

### 1. Probar Login

```bash
curl -X POST https://tu-backend.onrender.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoresi.com","password":"admin123"}'
```

Deberías recibir un token JWT.

### 2. Probar Crear Reporte (público)

```bash
curl -X POST https://tu-backend.onrender.com/api/v1/reportes \
  -H "Content-Type: application/json" \
  -d '{
    "latitud": -27.4519,
    "longitud": -58.9867,
    "comentario": "Prueba de reporte",
    "direccion": "Resistencia, Chaco"
  }'
```

### 3. Listar Reportes (admin)

```bash
curl https://tu-backend.onrender.com/api/v1/reportes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📊 Estructura de las Tablas

### Tabla `usuarios`
- `id` (UUID) - Primary Key
- `nombre` (VARCHAR 50)
- `email` (VARCHAR 100) - Unique
- `password` (VARCHAR 255) - Hasheado con bcrypt
- `rol` (VARCHAR 10) - Solo 'admin'
- `activo` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

### Tabla `reportes`
- `id` (UUID) - Primary Key
- `direccion` (VARCHAR 255) - Opcional
- `latitud` (DECIMAL 10,8) - Requerido
- `longitud` (DECIMAL 11,8) - Requerido
- `comentario` (TEXT) - Requerido
- `imagenUrl` (VARCHAR 500) - Opcional
- `fechaReporte` (DATE)
- `horaReporte` (TIME)
- `estado` (VARCHAR 20) - 'pendiente', 'aprobado', 'rechazado'
- `esZonaAfectada` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

---

## ✅ Checklist

- [ ] Tablas creadas en PostgreSQL
- [ ] Usuario admin creado
- [ ] Login funciona
- [ ] Crear reporte funciona
- [ ] Listar reportes funciona
- [ ] NODE_ENV vuelto a 'production'

---

¿Qué método prefieres usar? ¿El automático (cambiar NODE_ENV) o el manual (SQL)?
