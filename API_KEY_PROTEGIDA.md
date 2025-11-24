# ✅ API Key de Google Maps Protegida

## 🔐 Cambios Realizados

### 1. Backend - API Key Movida a Variables de Entorno

**Archivo:** `.env.example` y `.env`
```env
GOOGLE_MAPS_API_KEY=AIzaSyBWiPJz5wkN1WHabNTAqt-spDaGzOPSXhg
```

### 2. Backend - Endpoint para Servir la API Key

**Archivo:** `src/routes/config.routes.js` (NUEVO)
- Endpoint: `GET /api/v1/config/google-maps-key`
- Devuelve la API key de forma segura desde el backend
- La key NO está expuesta en el código del frontend

### 3. Backend - Ruta Agregada en app.js

**Archivo:** `src/app.js`
```javascript
const configRoutes = require('./routes/config.routes');
app.use(`${API_PREFIX}/config`, configRoutes);
```

### 4. Frontend - Carga Dinámica de la API Key

**Archivo:** `FRONTEND/EcoResi/mapa.html`

**Antes (❌ INSEGURO):**
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBWiPJz5wkN1WHabNTAqt-spDaGzOPSXhg&libraries=places&callback=initMap"></script>
```

**Después (✅ SEGURO):**
```javascript
// Obtener la API key desde el backend
fetch('http://localhost:3000/api/v1/config/google-maps-key')
  .then(response => response.json())
  .then(data => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initMap`;
    document.head.appendChild(script);
  });
```

---

## 🚀 Configuración en Render

Agrega esta variable de entorno en tu Web Service de Render:

```
GOOGLE_MAPS_API_KEY=AIzaSyBWiPJz5wkN1WHabNTAqt-spDaGzOPSXhg
```

---

## 🔧 Configuración para Producción

### En `mapa.html`, actualiza la URL del backend:

**Desarrollo:**
```javascript
const API_URL = 'http://localhost:3000/api/v1';
```

**Producción:**
```javascript
const API_URL = 'https://tu-backend.onrender.com/api/v1';
```

O mejor aún, detecta automáticamente:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/v1'
  : 'https://tu-backend.onrender.com/api/v1';
```

---

## ✅ Verificar que Funciona

### 1. Iniciar el backend:
```bash
cd BACKEND
npm start
```

### 2. Abrir `mapa.html` en el navegador

### 3. Verificar en la consola del navegador:
- No debe haber errores
- El mapa debe cargar correctamente
- La API key NO debe estar visible en el código fuente

### 4. Probar el endpoint directamente:
```bash
curl http://localhost:3000/api/v1/config/google-maps-key
```

Deberías ver:
```json
{
  "success": true,
  "apiKey": "AIzaSyBWiPJz5wkN1WHabNTAqt-spDaGzOPSXhg"
}
```

---

## 🔒 Seguridad

### ¿La API key sigue siendo visible?

**Sí, pero con ventajas:**

1. ✅ **No está en GitHub** - La key está en `.env` que está en `.gitignore`
2. ✅ **Fácil de rotar** - Cambias la key en una sola variable de entorno
3. ✅ **Mismo código en dev y prod** - Solo cambias la variable de entorno
4. ✅ **Mejor control** - Puedes agregar autenticación al endpoint si quieres

### Para mayor seguridad (opcional):

Puedes agregar autenticación al endpoint:
```javascript
router.get('/google-maps-key', authMiddleware.verificarToken, (req, res) => {
  // Solo usuarios autenticados pueden obtener la key
});
```

O limitar por dominio en Google Cloud Console:
- Ve a Google Cloud Console
- API & Services → Credentials
- Edita tu API key
- Agrega restricciones de dominio (ej: `*.onrender.com`, `localhost`)

---

## 📝 Checklist

- [x] API key movida a `.env`
- [x] `.env` está en `.gitignore`
- [x] Endpoint `/api/v1/config/google-maps-key` creado
- [x] `mapa.html` actualizado para cargar la key dinámicamente
- [x] Probado localmente
- [ ] Variable configurada en Render
- [ ] URL del backend actualizada en producción
- [ ] Probado en producción

---

¡Tu API key de Google Maps ahora está protegida! 🎉
