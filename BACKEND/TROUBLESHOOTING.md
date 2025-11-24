# Troubleshooting - Error de Conexión a PostgreSQL

## ❌ Error: `read ECONNRESET`

Este error indica que la conexión a PostgreSQL de Render se está cerrando inesperadamente.

---

## 🔍 Diagnóstico

### 1. Probar Conexión
```bash
node scripts/testConnection.js
```

Este script te dirá exactamente dónde está el problema.

---

## 🛠️ Soluciones Posibles

### Solución 1: Verificar Credenciales

Asegúrate de que el archivo `.env` tenga las credenciales correctas:

```env
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com/ecoresi
```

### Solución 2: Verificar Firewall/Antivirus

El firewall o antivirus puede estar bloqueando la conexión. Intenta:
- Desactivar temporalmente el firewall de Windows
- Desactivar temporalmente el antivirus
- Agregar una excepción para Node.js

### Solución 3: Probar desde Otra Red

El problema puede ser de tu red actual:
- Intenta conectarte desde datos móviles (hotspot)
- Intenta desde otra red WiFi
- Verifica si tu ISP bloquea conexiones a ciertos puertos

### Solución 4: Verificar Estado de Render

1. Entra a tu dashboard de Render: https://dashboard.render.com
2. Verifica que la base de datos esté activa (status: "Available")
3. Verifica que no haya mantenimientos programados

### Solución 5: Usar Conexión Interna (si estás en Render)

Si vas a deployar en Render, usa la URL interna:
```env
DATABASE_URL=postgresql://root:ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n@dpg-d4fbg849c44c73bltcpg-a/ecoresi
```

### Solución 6: Probar con psql

Si tienes PostgreSQL instalado localmente:
```bash
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi
```

Si esto funciona, el problema es con Node.js/Sequelize.
Si esto NO funciona, el problema es de red.

---

## 🔄 Alternativa: Usar Base de Datos Local

Si no puedes conectarte a Render, puedes usar PostgreSQL local para desarrollo:

### 1. Instalar PostgreSQL Local
- Descarga: https://www.postgresql.org/download/windows/
- Instala con password: `postgres`

### 2. Crear Base de Datos Local
```sql
CREATE DATABASE ecoresi;
CREATE USER root WITH PASSWORD 'mitre280';
GRANT ALL PRIVILEGES ON DATABASE ecoresi TO root;
```

### 3. Actualizar .env
```env
DATABASE_URL=postgresql://root:mitre280@localhost:5432/ecoresi
```

### 4. Reiniciar Servidor
```bash
npm start
```

---

## 📝 Información de Conexión

**Render PostgreSQL:**
- Host: `dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `ecoresi`
- User: `root`
- Password: `ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n`

**Usuario Admin (una vez conectado):**
- Email: `admin@ecoresi.com`
- Password: `admin123`
- Hash: `$2a$10$xs8OU1Fq7kPKrvzZvgVLW.TzKGZuuCOUO8PHD24MfysXVU8g0MGKK`

---

## ✅ Siguiente Paso

Una vez que la conexión funcione, ejecuta:
```bash
npm start
```

Y luego ejecuta el SQL para crear el usuario admin:
```bash
# Conectarse a PostgreSQL
psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi

# Ejecutar el SQL de scripts/createAdmin.sql
```

O usa un cliente SQL (DBeaver, pgAdmin, etc.) para ejecutar `scripts/createAdmin.sql`.
