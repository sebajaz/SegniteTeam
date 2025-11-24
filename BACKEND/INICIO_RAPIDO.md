# Pasos Rápidos de Instalación

## ⚠️ IMPORTANTE: Primero instalar dependencias

Parece que `npm install` no se completó correctamente. Por favor ejecuta:

```bash
cd BACKEND
npm install
```

Espera a que termine completamente (puede tardar unos minutos).

---

## Una vez instaladas las dependencias:

### 1. Generar Hash de Password
```bash
node scripts/hashPassword.js admin123
```

Copia el hash generado.

### 2. Conectarse a PostgreSQL de Render

**Opción A - psql (si lo tienes instalado):**
```bash
PGPASSWORD=ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n psql -h dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com -U root ecoresi
```

**Opción B - Cliente SQL (DBeaver, pgAdmin, TablePlus, etc.):**
- Host: `dpg-d4fbg849c44c73bltcpg-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `ecoresi`
- User: `root`
- Password: `ISYpnxK2pf2W4LAMMX3x5O5Feeag3O7n`

### 3. Ejecutar SQL para crear admin

Usa el hash que generaste en el paso 1:

```sql
INSERT INTO usuarios (id, nombre, email, password, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@ecoresi.com',
  'TU_HASH_AQUI',  -- Pega el hash del paso 1
  'admin',
  true,
  NOW(),
  NOW()
);
```

### 4. Iniciar el servidor
```bash
npm run dev
```

### 5. Probar login
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoresi.com","password":"admin123"}'
```

---

## Troubleshooting

### Error: "nodemon no se reconoce"
Nodemon está en devDependencies. Usa:
```bash
npx nodemon server.js
```

O usa directamente:
```bash
node server.js
```

### Error: "Cannot find module 'bcryptjs'"
```bash
npm install
```

### Las tablas no existen en PostgreSQL
El servidor las creará automáticamente al iniciar (si `NODE_ENV !== 'production'`).

---

¿Todo listo? ¡Ejecuta `npm run dev` y el backend estará funcionando! 🚀
