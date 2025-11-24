# Protección de la API Key de Google Maps

## Cambios principales
- La key vive en variables de entorno (`.env` y `.env.example`):  
  `GOOGLE_MAPS_API_KEY=TU_API_KEY`
- Endpoint seguro en backend: `GET /api/v1/config/google-maps-key` (archivo `src/routes/config.routes.js`).
- El frontend ya no hardcodea la key; la obtiene del backend y luego inserta el script de Google Maps dinámicamente.

## Uso en frontend
Ejemplo de carga (ya aplicado en `FRONTEND/EcoResiFINAL/mapa.html`):
```javascript
fetch('https://tu-backend.onrender.com/api/v1/config/google-maps-key')
  .then(r => r.json())
  .then(data => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initMap`;
    document.head.appendChild(script);
  })
  .catch(() => alert('No se pudo cargar el mapa'));
```

## Configuración en Render
- Agrega la variable de entorno `GOOGLE_MAPS_API_KEY` con tu key real.
- Revisa `ALLOWED_ORIGINS` para permitir tu dominio del frontend.

## Buenas prácticas adicionales
- Restringe la key en Google Cloud Console por HTTP referrer (`https://*.onrender.com`, tu dominio real, `http://localhost:*` para dev).
- Rota la key si ya estuvo expuesta públicamente antes.
- Si quieres más control, protege el endpoint con autenticación y/o rate limiting.
