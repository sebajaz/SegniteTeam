# Proteger API Keys con Variables de Entorno

## 🔐 Problema

Tienes una API key pública en tu código que no quieres subir a GitHub.

---

## ✅ Solución

### Para BACKEND (Node.js/Express)

#### 1. Agregar la API key al archivo `.env`

```env
# API Keys (NO subir a GitHub)
MI_API_KEY=tu_api_key_secreta_aqui
OTRA_API_KEY=otra_key_si_tienes
```

#### 2. Verificar que `.env` esté en `.gitignore`

El archivo `.gitignore` ya debe tener:
```
.env
.env.local
.env.*.local
```

#### 3. Usar la API key en tu código

**Antes (❌ INSEGURO):**
```javascript
const API_KEY = 'mi_api_key_publica_123456';
```

**Después (✅ SEGURO):**
```javascript
const API_KEY = process.env.MI_API_KEY;
```

#### 4. Actualizar `.env.example`

```env
# API Keys
MI_API_KEY=tu_api_key_aqui
OTRA_API_KEY=
```

#### 5. Configurar en Render

En las Environment Variables de Render, agrega:
```
MI_API_KEY=tu_api_key_secreta_aqui
```

---

### Para FRONTEND (React/Vite/HTML)

#### ⚠️ IMPORTANTE: Las API keys en el frontend NUNCA son 100% seguras

El frontend es público, cualquiera puede ver el código. Opciones:

#### Opción 1: Proxy a través del Backend (RECOMENDADO)

**Frontend:**
```javascript
// En lugar de llamar directamente a la API externa
const response = await fetch('/api/v1/proxy/mi-servicio', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**Backend (nuevo endpoint):**
```javascript
// routes/proxy.routes.js
router.post('/proxy/mi-servicio', async (req, res) => {
  const API_KEY = process.env.MI_API_KEY; // Segura en el backend
  
  const response = await fetch('https://api-externa.com/endpoint', {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
});
```

#### Opción 2: Variables de Entorno en Vite (menos seguro)

**Archivo `.env` en el frontend:**
```env
VITE_API_KEY=tu_api_key
```

**Uso en código:**
```javascript
const API_KEY = import.meta.env.VITE_API_KEY;
```

**⚠️ ADVERTENCIA:** Esto NO oculta la key, solo la hace menos obvia. Cualquiera puede verla en el código compilado.

---

## 📋 Checklist

- [ ] API key movida a `.env`
- [ ] `.env` está en `.gitignore`
- [ ] Código actualizado para usar `process.env.MI_API_KEY`
- [ ] `.env.example` actualizado (sin la key real)
- [ ] Variable configurada en Render
- [ ] Probado localmente
- [ ] Probado en producción

---

## 🔍 Verificar que NO se suba a GitHub

```bash
# Ver qué archivos se van a subir
git status

# Si .env aparece, agrégalo a .gitignore
echo ".env" >> .gitignore

# Verificar que .gitignore funciona
git status
# .env NO debe aparecer
```

---

## 🆘 Si ya subiste la API key a GitHub

1. **Revoca la API key inmediatamente** en el servicio que la provee
2. Genera una nueva API key
3. Actualiza tu `.env` con la nueva key
4. Limpia el historial de Git (opcional, avanzado):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch archivo-con-key.js" \
     --prune-empty --tag-name-filter cat -- --all
   ```

---

¿En qué archivo está tu API key? Compártelo y te ayudo a moverla correctamente. 🔐
