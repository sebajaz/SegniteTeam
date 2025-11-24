# Backend EcoResi - Arquitectura en Capas

Backend desarrollado con Node.js y Express utilizando una arquitectura en capas (Layered Architecture) que separa las responsabilidades de la aplicación.

## 🏗️ Arquitectura

La aplicación sigue el patrón de arquitectura en capas:

```
Cliente HTTP
    ↓
┌─────────────────────────────────────┐
│         CAPA DE RUTAS               │  Define endpoints
│         (routes/)                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│      CAPA DE CONTROLADORES          │  Maneja HTTP request/response
│      (controllers/)                 │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│      CAPA DE SERVICIOS              │  Lógica de negocio
│      (services/)                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│      CAPA DE REPOSITORIOS           │  Acceso a datos
│      (repositories/)                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│         CAPA DE MODELOS             │  Esquemas de datos
│         (models/)                   │
└─────────────────────────────────────┘
    ↓
Base de Datos (MongoDB)
```

### Middlewares (Transversales)
- **auth.middleware.js**: Autenticación y autorización
- **errorHandler.middleware.js**: Manejo centralizado de errores

## 📁 Estructura del Proyecto

```
BACKEND/
├── src/
│   ├── config/              # Configuraciones
│   │   └── database.js      # Conexión a MongoDB
│   │
│   ├── models/              # Modelos de datos (Mongoose schemas)
│   │   └── user.model.js
│   │
│   ├── repositories/        # Acceso a datos
│   │   └── user.repository.js
│   │
│   ├── services/            # Lógica de negocio
│   │   └── user.service.js
│   │
│   ├── controllers/         # Controladores HTTP
│   │   └── user.controller.js
│   │
│   ├── routes/              # Definición de rutas
│   │   └── user.routes.js
│   │
│   ├── middlewares/         # Middlewares personalizados
│   │   ├── auth.middleware.js
│   │   └── errorHandler.middleware.js
│   │
│   ├── utils/               # Utilidades
│   │   ├── logger.js
│   │   └── helpers.js
│   │
│   └── app.js               # Configuración de Express
│
├── server.js                # Punto de entrada
├── package.json             # Dependencias
├── .env.example             # Variables de entorno (ejemplo)
├── .gitignore               # Archivos ignorados
└── README.md                # Este archivo
```

## 🚀 Instalación

1. **Clonar el repositorio** (si aplica)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecoresi
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
```

4. **Iniciar MongoDB** (asegúrate de tener MongoDB instalado y corriendo)

5. **Iniciar el servidor**:
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 📋 Responsabilidades por Capa

### 1. **Routes (Rutas)**
- Define los endpoints de la API
- Aplica validaciones de entrada
- Asocia middlewares a rutas específicas
- **No contiene lógica de negocio**

### 2. **Controllers (Controladores)**
- Recibe las peticiones HTTP
- Valida datos de entrada (con express-validator)
- Llama a los servicios correspondientes
- Formatea y envía respuestas HTTP
- **No contiene lógica de negocio**

### 3. **Services (Servicios)**
- Contiene toda la lógica de negocio
- Orquesta llamadas a repositorios
- Maneja reglas de negocio complejas
- Genera tokens, validaciones de negocio, etc.
- **No conoce HTTP ni base de datos directamente**

### 4. **Repositories (Repositorios)**
- Única capa que interactúa con la base de datos
- Operaciones CRUD
- Queries y agregaciones
- **No contiene lógica de negocio**

### 5. **Models (Modelos)**
- Define esquemas de datos (Mongoose)
- Validaciones a nivel de base de datos
- Hooks (pre/post save, etc.)
- Métodos de instancia

### 6. **Middlewares**
- Funciones que se ejecutan antes de los controladores
- Autenticación, autorización, logging, etc.
- Manejo de errores global

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:

1. El usuario se registra o hace login
2. El servidor genera un token JWT
3. El cliente incluye el token en el header `Authorization: Bearer <token>`
4. El middleware `auth.middleware.js` valida el token en rutas protegidas

### Roles disponibles:
- `usuario`: Usuario normal
- `recolector`: Personal de recolección
- `admin`: Administrador del sistema

## 📡 API Endpoints (Ejemplo - Usuarios)

### Públicos
- `POST /api/v1/users/register` - Registrar usuario
- `POST /api/v1/users/login` - Iniciar sesión

### Protegidos (requieren token)
- `GET /api/v1/users/perfil` - Obtener perfil del usuario autenticado

### Admin (requieren token + rol admin)
- `GET /api/v1/users` - Listar todos los usuarios
- `GET /api/v1/users/:id` - Obtener usuario por ID
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario

## 🛠️ Tecnologías

- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación
- **bcryptjs**: Encriptación de contraseñas
- **express-validator**: Validación de datos
- **helmet**: Seguridad HTTP
- **cors**: Cross-Origin Resource Sharing
- **morgan**: Logging de peticiones

## 📝 Ejemplo de Flujo

**Registro de usuario:**

1. Cliente → `POST /api/v1/users/register`
2. **Route** → Aplica validaciones y llama al controlador
3. **Controller** → Recibe datos, llama al servicio
4. **Service** → Valida email único, llama al repositorio
5. **Repository** → Crea usuario en BD
6. **Service** → Genera token JWT
7. **Controller** → Devuelve respuesta con usuario y token
8. Cliente ← Recibe respuesta

## 🔄 Agregar Nuevas Funcionalidades

Para agregar un nuevo módulo (ej: "productos"):

1. **Crear modelo**: `src/models/producto.model.js`
2. **Crear repositorio**: `src/repositories/producto.repository.js`
3. **Crear servicio**: `src/services/producto.service.js`
4. **Crear controlador**: `src/controllers/producto.controller.js`
5. **Crear rutas**: `src/routes/producto.routes.js`
6. **Registrar rutas** en `src/app.js`:
```javascript
const productoRoutes = require('./routes/producto.routes');
app.use(`${API_PREFIX}/productos`, productoRoutes);
```

## 🧪 Testing

```bash
npm test
```

## 📄 Licencia

ISC
