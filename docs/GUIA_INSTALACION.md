# Guía de Instalación y Ejecución - Kuichi

Esta guía detalla los pasos necesarios para descargar, configurar y ejecutar la aplicación **Kuichi** en un nuevo entorno de desarrollo (otra PC), específicamente para probarla en un emulador de Android.

## 1. Requisitos Previos

Asegúrate de tener instalado el siguiente software en tu computadora:

*   **Node.js** (v20 o superior recomendado).
*   **Git**.
*   **Android Studio** (con el SDK de Android y un dispositivo virtual/emulador configurado).
*   **Java Development Kit (JDK)** (versión 17 o superior, generalmente incluido con Android Studio).

## 2. Descargar el Proyecto

Clona el repositorio desde GitHub:

```bash
git clone <URL_DEL_REPOSITORIO>
cd kuichi
```

Asegúrate de estar en la rama correcta (donde están los últimos cambios):

```bash
git checkout V2.0
```

## 3. Instalar Dependencias

Instala las librerías de Node.js necesarias para el proyecto:

```bash
npm install
```

## 4. Preparar el Entorno Nativo

Construye la aplicación web y sincroniza los cambios con la carpeta nativa de Android:

```bash
# 1. Compilar el código web (Angular)
npm run build

# 2. Sincronizar con Capacitor (descarga plugins nativos y actualiza la carpeta android/)
npx ionic cap sync android
```

## 5. Ejecutar en Android

### Opción A: Desde Android Studio (Recomendado para primera vez)

Este comando abrirá el proyecto en Android Studio:

```bash
npx ionic cap open android
```

1.  Espera a que Gradle termine de sincronizar (puede tardar unos minutos la primera vez).
2.  Selecciona tu emulador en la barra superior.
3.  Presiona el botón **Run** (▶️) o `Shift + F10`.

### Opción B: Desde Línea de Comandos

Si ya tienes el emulador corriendo o un dispositivo conectado:

```bash
npx ionic cap run android
```

## 6. Solución de Problemas Comunes

*   **Error de Gradle:** Si ves errores relacionados con Gradle, intenta ejecutar "File > Sync Project with Gradle Files" en Android Studio.
*   **Error de Node:** Si `npm install` falla, verifica que estás usando Node v20+ (`node -v`).
*   **Pantalla en Blanco:** Si la app inicia pero se queda en blanco, verifica la consola de Chrome (inspect) para ver si hay errores de JavaScript. Recuerda que los datos antiguos no cifrados no se cargarán.

---

**Nota de Seguridad:** Al iniciar la app por primera vez en un nuevo dispositivo, no habrá datos. Crea un nuevo usuario o inicia sesión para generar tu base de datos local cifrada.
