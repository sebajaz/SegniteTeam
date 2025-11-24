# Solución: Error de Conexión PostgreSQL en Render

## 🔴 Problema Común

Render requiere SSL para conexiones a PostgreSQL, y la configuración debe ser exacta.

---

## ✅ Solución 1: Verificar Variables de Entorno en Render

### En tu Web Service de Render:

1. Ve a **Environment** en tu Web Service
2. Verifica que tengas **DATABASE_URL** configurada
3. Si NO está, agrégala manualmente:

**Formato correcto:**
```
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com/ecoresi
```

### O usa la URL INTERNA si el backend está en Render:

```
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a/ecoresi
```

**La URL interna es más rápida y confiable dentro de Render.**

---

## ✅ Solución 2: Verificar Configuración SSL en database.js

Asegúrate de que `src/config/database.js` tenga SSL habilitado:

```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});
```

**Ya está configurado correctamente en tu código.**

---

## ✅ Solución 3: Vincular Base de Datos en Render

### Opción A - Vincular automáticamente:

1. En tu **Web Service**, ve a **Environment**
2. Busca la sección **"Add from Database"**
3. Selecciona tu base de datos PostgreSQL `ecoresi`
4. Render agregará automáticamente `DATABASE_URL`

### Opción B - Configurar manualmente:

1. Ve a tu **PostgreSQL Database** en Render
2. Copia la **Internal Database URL** (más rápida)
3. Pégala en las variables de entorno de tu Web Service

---

## ✅ Solución 4: Verificar Estado de la Base de Datos

1. Ve a tu **PostgreSQL Database** en Render
2. Verifica que el estado sea **"Available"** (no "Creating" o "Suspended")
3. Si está suspendida, reactívala

---

## ✅ Solución 5: Verificar Logs de Deploy

1. En tu Web Service, ve a **Logs**
2. Busca el error exacto de conexión
3. Comparte el error si necesitas más ayuda

**Errores comunes:**

- `ECONNREFUSED` → La BD no está disponible o URL incorrecta
- `ECONNRESET` → Problema de SSL o firewall
- `password authentication failed` → Credenciales incorrectas
- `database "ecoresi" does not exist` → La BD no se creó

---

## ✅ Solución 6: Crear las Tablas Manualmente

Si las tablas no se crean automáticamente:

### Opción A - Cambiar NODE_ENV temporalmente:

1. En **Environment Variables**, cambia:
   ```
   NODE_ENV=development
   ```
2. Espera a que el deploy termine
3. Las tablas se crearán automáticamente
4. Vuelve a cambiar:
   ```
   NODE_ENV=production
   ```

### Opción B - Conectarse y crear manualmente:

```bash
# Conectarse a PostgreSQL de Render
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi

# Verificar que la BD existe
\l

# Verificar tablas
\dt

# Si no hay tablas, el servidor las creará al iniciar con NODE_ENV=development
```

---

## 🔧 Configuración Recomendada para Render

### Variables de Entorno:

```
NODE_ENV=production
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a/ecoresi
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://tu-frontend.onrender.com
API_PREFIX=/api/v1
```

**Nota:** Usa la URL **interna** (sin `.oregon-postgres.render.com`) para mejor rendimiento.

---

## 📝 Checklist de Troubleshooting

- [ ] DATABASE_URL está configurada en Environment Variables
- [ ] La URL de la base de datos es correcta (interna o externa)
- [ ] La base de datos está en estado "Available"
- [ ] SSL está habilitado en database.js (ya está)
- [ ] NODE_ENV está en "production" o "development"
- [ ] Los logs muestran el error exacto
- [ ] Las credenciales son correctas

---

## 🆘 Si Nada Funciona

**Prueba con URL Externa primero:**
```
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com/ecoresi
```

**Luego cambia a URL Interna:**
```
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a/ecoresi
```

---

## 📸 ¿Puedes compartir?

Para ayudarte mejor, comparte:
1. El error exacto de los logs de Render
2. Screenshot de tus Environment Variables
3. El estado de tu base de datos PostgreSQL

¡Con eso podré darte una solución más específica! 🚀
