# Explicación del Proyecto Kuichi

## 1. Resumen General

**Kuichi** es una aplicación móvil y web desarrollada con **Ionic y Angular**. Su propósito principal es servir como una plataforma para dueños de mascotas, permitiéndoles gestionar la información de sus animales, encontrar servicios veterinarios y acceder a ofertas especiales.

La aplicación está diseñada para ser multiplataforma gracias al uso de Capacitor, lo que significa que puede ser desplegada como una aplicación nativa para iOS y Android, y también como una Aplicación Web Progresiva (PWA) accesible desde cualquier navegador moderno.

## 2. Características Principales

- **Gestión de Mascotas:** Los usuarios pueden registrar sus mascotas, incluyendo detalles como especie, edad, vacunas, y cuidados especiales. El modelo de datos es robusto y contempla incluso mascotas exóticas con requerimientos específicos.
- **Búsqueda de Veterinarias:** La aplicación proporciona una lista de clínicas veterinarias. Aunque actualmente los datos son de prueba (mock), la estructura está preparada para mostrar información detallada como nombre, dirección, especialidades y ubicación en un mapa.
- **Sección de Ofertas:** Una sección dedicada a mostrar ofertas, presumiblemente relacionadas con productos o servicios para mascotas.
- **Autenticación de Usuarios:** El acceso a las secciones principales (Mascotas, Veterinarias, Ofertas) está protegido y requiere que el usuario inicie sesión. El sistema de autenticación maneja el estado de la sesión y la protege contra expiración.

## 3. Pila Tecnológica (Tech Stack)

- **Framework Principal:** [Angular](https://angular.io/) (v17+ con componentes standalone).
- **UI y Plataforma Móvil:** [Ionic Framework](https://ionicframework.com/).
- **Runtime Nativo:** [Capacitor](https://capacitorjs.com/) para el acceso a funcionalidades nativas y despliegue en iOS/Android.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/).
- **Estilos:** SCSS para la estilización de componentes.
- **Enrutamiento:** `RouterModule` de Angular para la navegación entre páginas.
- **Cliente HTTP:** `HttpClient` de Angular para la comunicación con APIs externas.
- **Gestión de Estado (simple):** RxJS `BehaviorSubject` para gestionar el estado del usuario en `AuthService`.

## 4. Estructura del Proyecto

El código fuente se encuentra principalmente en el directorio `src/app`.

```
src/app/
├── guards/
│   └── auth.guard.ts       # Guarda que protege rutas y verifica la autenticación.
├── home/
│   └── home.page.ts        # Página de inicio o bienvenida.
├── models/
│   ├── mascota.model.ts    # Interfaz que define la estructura de datos de una Mascota.
│   └── veterinaria.model.ts# Interfaz para los datos de una Clínica Veterinaria.
├── pages/
│   ├── mascotas/           # Página para listar y gestionar las mascotas del usuario.
│   ├── ofertas/            # Página para mostrar ofertas.
│   └── veterinarias/       # Página para buscar y ver detalles de veterinarias.
├── services/
│   ├── auth.service.ts     # Lógica de negocio para autenticación (login, logout, etc.).
│   └── veterinaria.service.ts # Provee los datos de las veterinarias (actualmente mock).
├── app.component.ts        # Componente raíz de la aplicación.
└── app.routes.ts           # Define las rutas de navegación de la aplicación.
```

## 5. Flujo y Lógica de la Aplicación

### 5.1. Enrutamiento

El archivo `app.routes.ts` define las rutas principales:

- `/home`: Página de inicio, accesible para todos.
- `/mascotas`, `/ofertas`, `/veterinarias`: Rutas protegidas por `auth.guard`. Si un usuario no autenticado intenta acceder, es redirigido a la página de inicio.

El enrutamiento utiliza carga diferida (`loadComponent`) para cargar las páginas solo cuando son necesarias, mejorando el rendimiento inicial de la aplicación.

### 5.2. Autenticación (`AuthService` y `AuthGuard`)

- **`AuthService`**:
    - Gestiona el inicio y cierre de sesión.
    - El método `login` se comunica con una API externa de prueba (`JSONPlaceholder`) para validar al usuario por su email. En un entorno real, aquí se haría una petición POST con email y contraseña a un backend propio.
    - Almacena los datos del usuario en `localStorage` para persistir la sesión.
    - Utiliza un `BehaviorSubject` (`user$`) para que los componentes puedan reaccionar en tiempo real a los cambios en el estado de autenticación (login/logout).
    - La sesión se considera válida por 24 horas. Después de ese tiempo, `isAuthenticated()` devolverá `false` y se limpiará la sesión.

- **`authGuard`**:
    - Es una función `CanActivateFn` que se ejecuta antes de activar una ruta.
    - Inyecta `AuthService` para verificar si el usuario está autenticado (`isAuthenticated()`).
    - Si el usuario no está autenticado, lo redirige a la página de inicio (`/`) y bloquea el acceso a la ruta solicitada.

### 5.3. Servicios de Datos

- **`VeterinariaService`**:
    - Actualmente, este servicio no realiza una llamada HTTP. En su lugar, devuelve una lista de veterinarias predefinidas (mock data) como un `Observable` usando `of()`.
    - En una aplicación de producción, este servicio usaría `HttpClient` para obtener los datos de una API real, similar a como lo hace `AuthService`.

### 5.4. Modelos de Datos

- **`Mascota`**: Define una estructura muy completa para los datos de una mascota. Incluye campos para información básica, datos de salud, e incluso un apartado detallado para mascotas exóticas con requerimientos de ambiente (temperatura, humedad) y permisos.
- **`Veterinaria`**: Define la estructura para los datos de una clínica, incluyendo su geolocalización (latitud y longitud), lo que sugiere la posibilidad de integrarse con un mapa en el futuro.

## 6. Cómo Ejecutar el Proyecto

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Ejecutar en modo desarrollo (navegador):**
    Este comando levanta un servidor local y abre la aplicación en el navegador.
    ```bash
    ionic serve
    ```
3.  **Construir para producción:**
    ```bash
    npm run build
    ```
4.  **Ejecutar en dispositivos (requiere configuración de Capacitor):**
    ```bash
    # Añadir plataforma (ios o android)
    npx cap add android
    npx cap add ios

    # Sincronizar el proyecto web con el nativo
    npx cap sync

    # Abrir el IDE nativo para compilar y ejecutar
    npx cap open android
    npx cap open ios
    ```
