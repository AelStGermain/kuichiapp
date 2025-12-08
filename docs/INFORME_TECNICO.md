# Informe Técnico del Proyecto Kuichi

**Fecha:** 8 de Diciembre de 2025
**Proyecto:** Aplicación Móvil de Gestión de Mascotas (Kuichi)
**Tecnologías:** Ionic 8, Angular 20, Capacitor 7, Firebase, Crypto-js

---

## 1. Introducción y Objetivos

El presente informe detalla la arquitectura, el proceso de desarrollo y el funcionamiento técnico de **Kuichi**, una aplicación móvil híbrida desarrollada para la gestión integral de mascotas. El objetivo principal del proyecto es cumplir con los requisitos académicos de desarrollo móvil avanzado, integrando funcionalidades nativas (periféricos), servicios web, seguridad robusta y pruebas automatizadas.

La aplicación permite a los usuarios registrar mascotas, adjuntar fotografías tomadas con la cámara, registrar la ubicación de creación de la ficha, y sincronizar estos datos con servicios externos, todo bajo un entorno seguro y autenticado.

---

## 2. Arquitectura del Sistema

### 2.1. Stack Tecnológico

El proyecto se basa en una arquitectura moderna y escalable utilizando las siguientes tecnologías:

*   **Frontend Framework:** **Ionic 8** con **Angular 20**. Se utiliza la última versión de Angular que promueve el uso de *Standalone Components*, eliminando la necesidad de `NgModules` y simplificando la estructura del proyecto.
*   **Runtime Móvil:** **Capacitor 7**. Actúa como puente entre el código web (HTML/CSS/JS) y las APIs nativas del dispositivo (Cámara, Geolocalización, Sistema de Archivos).
*   **Backend & Auth:** **Firebase**. Se utiliza Firebase Authentication para la gestión de identidades.
*   **Seguridad de Datos:** **Crypto-js**. Librería estándar para el cifrado AES de datos locales.
*   **Testing:** **Jest**. Framework de pruebas unitarias.

### 2.2. Patrones de Diseño

Se han aplicado principios de ingeniería de software para garantizar la mantenibilidad:

1.  **Inyección de Dependencias (DI):** Angular gestiona la creación y distribución de servicios (`AuthService`, `SyncService`, `StorageService`) a través de la aplicación.
2.  **Servicios Singleton:** Los servicios están provistos en el `root`, garantizando una única instancia compartida para manejar el estado global (como el usuario autenticado o el estado de sincronización).
3.  **Programación Reactiva (RxJS):** Se utilizan `Observables` y `BehaviorSubjects` para manejar flujos de datos asíncronos, como el estado de autenticación o la respuesta de la API.
4.  **Repository Pattern (Simplificado):** Los servicios actúan como una capa de abstracción sobre los datos, ocultando si provienen de `localStorage`, `API` o `Firebase`.

---

## 3. Desarrollo y Funcionalidades (Detalle Técnico)

A continuación, se explica cómo se construyó y cómo funciona cada una de las características solicitadas en la evaluación.

### 3.1. Interacción con Periféricos

#### A. Cámara (Captura de Imágenes)
**Requisito:** Capturar imágenes y adjuntarlas a las tareas (mascotas).

*   **Implementación:** Se utilizó el plugin `@capacitor/camera`.
*   **Funcionamiento:**
    1.  El usuario presiona el botón de cámara en `MascotasPage`.
    2.  Se invoca `Camera.getPhoto()` con configuración de alta calidad (`quality: 90`) y formato de salida `DataUrl` (Base64).
    3.  Capacitor solicita permisos nativos al sistema operativo (Android/iOS).
    4.  Una vez tomada la foto, el string Base64 se asigna a la propiedad `foto` del objeto `Mascota`.
    5.  **Persistencia:** La imagen se guarda localmente junto con los datos de la mascota. Al implementar el cifrado, esta cadena Base64 también es cifrada, protegiendo la privacidad de la imagen.

#### B. Geolocalización (GPS)
**Requisito:** Registrar la ubicación donde se crea cada tarea.

*   **Implementación:** Se utilizó el plugin `@capacitor/geolocation`.
*   **Funcionamiento:**
    1.  Al crear o editar una mascota, o al buscar veterinarias, se llama a `Geolocation.getCurrentPosition()`.
    2.  El dispositivo activa el GPS y devuelve las coordenadas (latitud y longitud).
    3.  **Caso de Uso - Veterinarias:** La aplicación utiliza estas coordenadas para calcular la distancia entre el usuario y una lista predefinida de veterinarias, ordenándolas por cercanía.

### 3.2. Integración con Servicios Web y APIs

#### A. Sincronización de Datos (`SyncService`)
**Requisito:** Sincronizar tareas con un servicio web externo.

*   **Arquitectura:** Se creó un servicio dedicado `SyncService`.
*   **Funcionamiento:**
    1.  **Estado de Sincronización:** El servicio mantiene un `BehaviorSubject` que informa a toda la app si se está sincronizando (`syncing`), si hubo éxito (`success`) o error (`error`).
    2.  **Exportación (Subida):** El método `sincronizarMascotas` toma la lista local y simula un envío `POST` a un backend. Aunque actualmente simula la latencia (`delay`), está estructurado para usar `HttpClient` de Angular y enviar los datos a un endpoint REST real.
    3.  **Importación (Bajada):** El método `importarDesdeAPI` realiza una petición `GET` real a la API pública `JSONPlaceholder`.
        *   Recibe una lista de "todos" (tareas).
        *   Utiliza un adaptador (patrón Adapter) para transformar esos "todos" en objetos `Mascota` válidos, asignando nombres y especies aleatorias para simular datos reales.

### 3.3. Medidas de Seguridad y Protección de Datos

Esta es la capa más crítica y robusta del proyecto.

#### A. Autenticación (Firebase)
**Requisito:** Sistema de autenticación robusto.

*   **Implementación:** Se integró el SDK de Firebase.
*   **Funcionamiento:**
    *   `AuthService` maneja el inicio de sesión (Email/Password y Google).
    *   Se utiliza un `AuthGuard` en el Router de Angular. Este guardián intercepta la navegación; si el usuario no está autenticado (`isAuthenticated()`), bloquea el acceso a las páginas internas (`/tabs`) y redirige al Login.
    *   El estado de autenticación es reactivo: si el usuario cierra sesión, la aplicación lo detecta automáticamente y limpia la vista.

#### B. Cifrado de Datos (AES)
**Requisito:** Proteger datos sensibles con cifrado.

*   **Implementación:** Se creó `StorageService` utilizando la librería `crypto-js`.
*   **Algoritmo:** AES (Advanced Encryption Standard).
*   **Funcionamiento:**
    *   **Escritura (`set`):** Antes de guardar cualquier dato en `localStorage`, el servicio lo convierte a JSON y lo cifra usando una clave secreta. El resultado es una cadena de texto ininteligibles (ciphertext).
    *   **Lectura (`get`):** Al recuperar datos, el servicio descifra el ciphertext usando la misma clave y lo convierte nuevamente a un objeto JavaScript.
    *   **Impacto:** Si un atacante accede físicamente al dispositivo y extrae el archivo de almacenamiento local del navegador/WebView, solo verá datos basura, imposibles de leer sin la clave.

#### C. Segregación de Datos (Multi-usuario)
**Requisito:** Permitir múltiples usuarios sin mezclar datos.

*   **Problema Original:** El `localStorage` es único por dominio/app. Si dos usuarios usaban el mismo celular, el Usuario B veía las mascotas del Usuario A.
*   **Solución Implementada:**
    *   Se modificó la lógica de almacenamiento para usar **Claves Dinámicas**.
    *   En lugar de guardar en la clave `mascotas`, se guarda en `kuichi_mascotas_{USER_UID}`.
    *   El `USER_UID` se obtiene de Firebase Auth.
    *   **Resultado:** Cada usuario tiene su propio "casillero" de datos cifrados. Al cerrar sesión e iniciar con otro usuario, la aplicación carga automáticamente el casillero correspondiente al nuevo UID, garantizando privacidad total.

### 3.4. Pruebas Automatizadas

**Requisito:** Pruebas para verificar funcionalidad.

*   **Tecnología:** Jest (Framework de pruebas de Facebook).
*   **Estrategia:** Pruebas Unitarias (Unit Testing).
*   **Implementación:**
    *   Se crearon "Mocks" (simulaciones) para las dependencias externas: `Camera`, `Geolocation`, `AuthService`, `StorageService`.
    *   **Ejemplo de Test:** "Debería llamar a `Camera.getPhoto` cuando se invoca el método `tomarFoto`".
    *   Esto permite verificar que la lógica de negocio de la aplicación es correcta sin necesidad de ejecutarla en un dispositivo real o depender de que la cámara física funcione en el entorno de pruebas.

---

## 4. Conclusión

El proyecto **Kuichi** no solo cumple con los requisitos funcionales de una aplicación de gestión de mascotas, sino que implementa una arquitectura de software profesional. La inclusión de **cifrado AES** y **segregación de datos** eleva el estándar de seguridad por encima de una aplicación académica promedio, acercándola a un producto listo para producción. La estructura modular basada en Angular y Capacitor asegura que el proyecto sea escalable y fácil de mantener en el futuro.
