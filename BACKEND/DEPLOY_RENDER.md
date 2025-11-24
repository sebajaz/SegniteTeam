# Guía de Deploy en Render

## 📋 Variables de Entorno para Render

Cuando crees el Web Service en Render, configura estas variables de entorno:

### Variables Obligatorias

```env
# Node Environment
NODE_ENV=production

# Puerto (Render lo asigna automáticamente, pero puedes dejarlo)
PORT=3000

# Database (Render lo configura automáticamente si vinculas la BD)
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com/ecoresi

# JWT Secret (IMPORTANTE: Cambia esto por un valor seguro)
JWT_SECRET=tu_clave_secreta_super_segura_para_produccion_cambiar_esto
JWT_EXPIRES_IN=7d

# CORS - Agrega el dominio de tu frontend
ALLOWED_ORIGINS=https://tu-frontend.onrender.com,https://tu-dominio.com

# API Prefix
API_PREFIX=/api/v1
```

### Variables Opcionales (Cloudinary)

Si vas a usar Cloudinary para almacenar imágenes:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## 🚀 Pasos para Deploy en Render

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub/GitLab:

```bash
git add .
git commit -m "Backend listo para deploy"
git push origin main
```

### 2. Crear Web Service en Render

1. Ve a https://dashboard.render.com
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repositorio del backend

### 3. Configurar el Web Service

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Selecciona `Node`
- Versión: `18` o superior

**Root Directory:**
- Si tu backend está en una subcarpeta: `BACKEND`
- Si está en la raíz: dejar vacío

### 4. Configurar Variables de Entorno

En la sección "Environment Variables", agrega:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | (Render lo configura automáticamente si vinculas la BD) |
| `JWT_SECRET` | `tu_clave_secreta_super_segura_cambiar` |
| `JWT_EXPIRES_IN` | `7d` |
| `ALLOWED_ORIGINS` | `https://tu-frontend.onrender.com` |
| `API_PREFIX` | `/api/v1` |

### 5. Vincular Base de Datos PostgreSQL

**Opción A - Si ya creaste la BD en Render:**
1. En el Web Service, ve a "Environment"
2. Click en "Add Environment Variable"
3. Render detectará automáticamente tu BD PostgreSQL
4. Selecciona la BD `ecoresi` que ya creaste
5. Render agregará automáticamente `DATABASE_URL`

**Opción B - Usar la BD existente manualmente:**
- Copia el `DATABASE_URL` de tu BD PostgreSQL en Render
- Pégalo en las variables de entorno

### 6. Deploy

1. Click en "Create Web Service"
2. Render comenzará a hacer el build y deploy
3. Espera a que el estado sea "Live" (puede tardar 2-5 minutos)

---

## ✅ Verificar que Funciona

Una vez deployado, prueba:

### Health Check
```bash
curl https://tu-backend.onrender.com/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123.45
}
```

### Login Admin
```bash
curl -X POST https://tu-backend.onrender.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoresi.com","password":"admin123"}'
```

---

## 🔧 Configuración Adicional

### Crear Usuario Admin en Producción

1. Conectarse a PostgreSQL de Render:
```bash
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi
```

2. Ejecutar el SQL de `scripts/createAdmin.sql`:
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
);
```

### Configurar Dominio Personalizado (Opcional)

1. En Render, ve a "Settings" → "Custom Domain"
2. Agrega tu dominio (ej: `api.ecoresi.com`)
3. Configura los DNS según las instrucciones de Render

---

## 📝 Notas Importantes

### Sincronización de Modelos

En producción (`NODE_ENV=production`), Sequelize NO sincronizará automáticamente los modelos.

**Opciones:**

1. **Cambiar temporalmente a development** para que cree las tablas:
   - Cambia `NODE_ENV` a `development`
   - Espera a que el servidor inicie y cree las tablas
   - Vuelve a cambiar `NODE_ENV` a `production`

2. **Usar migraciones** (recomendado para producción):
   ```bash
   npx sequelize-cli migration:generate --name create-tables
   npx sequelize-cli db:migrate
   ```

### Logs

Para ver los logs en Render:
1. Ve a tu Web Service
2. Click en "Logs"
3. Verás todos los console.log del servidor

### Reiniciar Servicio

Si necesitas reiniciar:
1. Ve a "Settings"
2. Click en "Manual Deploy" → "Clear build cache & deploy"

---

## 🎯 Checklist de Deploy

- [ ] Código pusheado a GitHub/GitLab
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL vinculada
- [ ] Build exitoso
- [ ] Servicio en estado "Live"
- [ ] Health check responde correctamente
- [ ] Tablas creadas en PostgreSQL
- [ ] Usuario admin creado
- [ ] Login funciona correctamente
- [ ] CORS configurado con dominio del frontend

---

## 🔗 URLs Importantes

- **Dashboard Render:** https://dashboard.render.com
- **PostgreSQL Dashboard:** https://dashboard.render.com/d/dpg-d4fbg849c44c73bltcpg-a
- **Tu Backend (después de deploy):** https://tu-nombre-servicio.onrender.com

---

¡Listo para deploy! 🚀
