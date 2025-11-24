# Script de Instalación y Configuración - Backend EcoResi

## 🚀 Pasos para Instalar y Ejecutar

### 1. Instalar Dependencias

**Opción A - PowerShell (si tienes permisos):**
```powershell
cd BACKEND
npm install
```

**Opción B - CMD (alternativa):**
```cmd
cd BACKEND
npm install
```

**Opción C - Si hay error de política de ejecución:**
```powershell
# Ejecutar PowerShell como Administrador y ejecutar:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego ejecutar:
npm install
```

---

### 2. Crear Archivo .env

Crear un archivo llamado `.env` en la carpeta `BACKEND` con el siguiente contenido:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL - Render)
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com/ecoresi

# O usar variables individuales (opcional)
DB_HOST=dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=ecoresi
DB_USER=root
DB_PASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n

# JWT Configuration
JWT_SECRET=ecoresi_secret_key_2024_super_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary (opcional - dejar vacío si usas almacenamiento local)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# API Configuration
API_PREFIX=/api/v1
```

**Comando rápido para crear .env (PowerShell):**
```powershell
Copy-Item .env.example .env
# Luego editar el archivo .env con las credenciales
```

---

### 3. Crear Usuario Administrador en PostgreSQL

**Opción A - Conectarse a PostgreSQL de Render:**
```bash
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi
```

**Opción B - Usar un cliente SQL (DBeaver, pgAdmin, etc.):**
- Host: `dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `ecoresi`
- User: `root`
- Password: `ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n`

**SQL para crear usuario admin:**
```sql
-- Primero, asegúrate de que las tablas existan (se crean automáticamente al iniciar el servidor)
-- Luego, inserta el usuario admin:

INSERT INTO usuarios (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@ecoresi.com',
  '$2a$10$rOvHPnJ9Z1qZ1qZ1qZ1qZOeKx5x5x5x5x5x5x5x5x5x5x5x5x5x5',  -- Password: admin123
  'admin',
  true,
  NOW(),
  NOW()
);
```

> **IMPORTANTE**: El password hasheado arriba es un ejemplo. Para generar uno real, puedes:
> 1. Iniciar el servidor
> 2. Usar un script de Node.js para hashear:

```javascript
const bcrypt = require('bcryptjs');
const password = 'tu_password_aqui';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

---

### 4. Iniciar el Servidor

**Modo Desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo Producción:**
```bash
npm start
```

El servidor iniciará en: `http://localhost:3000`

---

### 5. Verificar que Funciona

**Health Check:**
```bash
curl http://localhost:3000/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

**Login Admin:**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoresi.com","password":"admin123"}'
```

---

## 📝 Endpoints Disponibles

### Públicos (sin autenticación)
- `POST /api/v1/reportes` - Crear reporte con imagen

### Admin (requieren token JWT)
- `POST /api/v1/users/login` - Login
- `GET /api/v1/reportes` - Listar reportes
- `GET /api/v1/reportes/:id` - Detalle de reporte
- `PUT /api/v1/reportes/:id/aprobar` - Aprobar reporte
- `PUT /api/v1/reportes/:id/rechazar` - Rechazar reporte
- `GET /api/v1/reportes/zonas-afectadas` - Zonas afectadas
- `GET /api/v1/reportes/estadisticas` - Estadísticas
- `POST /api/v1/reportes/recalcular-zonas` - Recalcular zonas

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'sequelize'"
```bash
npm install
```

### Error: "Connection refused" a PostgreSQL
- Verifica que las credenciales en `.env` sean correctas
- Verifica que tengas conexión a internet (Render está en la nube)

### Error: "ENOENT: no such file or directory, open 'uploads/...'"
```bash
mkdir uploads
```

### Las tablas no se crean en PostgreSQL
- Asegúrate de que `NODE_ENV` NO sea `production` en `.env`
- O ejecuta manualmente las migraciones/sincronización

---

## ✅ Checklist de Instalación

- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado con credenciales de Render
- [ ] Usuario admin creado en PostgreSQL
- [ ] Servidor inicia sin errores (`npm run dev`)
- [ ] Health check responde correctamente
- [ ] Login admin funciona
- [ ] Carpeta `uploads/` existe

---

¡Listo para usar! 🎉
