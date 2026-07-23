# Kuichi Mobile

Kuichi es una experiencia móvil para centralizar el cuidado cotidiano de las
mascotas: perfiles, datos importantes, veterinarias cercanas y beneficios.

La versión publicada incluye un acceso de demostración sin registro para que el
flujo principal pueda evaluarse en segundos. Los datos de esa sesión se guardan
localmente en el navegador.

## Funcionalidades

- Perfil y gestión de mascotas con fotografía.
- Pasaporte digital con QR generado localmente.
- Línea de tiempo sanitaria, vacunas y próximos controles.
- Modo mascota perdida y contenido preparado para compartir.
- Persistencia local para una experiencia funcional sin backend.
- Consulta de veterinarias y acceso a mapa o llamada.
- Ofertas y beneficios para servicios de cuidado.
- Autenticación opcional con Firebase y Google.
- Diseño responsive orientado a teléfonos, con navegación por pestañas.

## Desarrollo local

Requiere Node.js 20.

```bash
npm ci
npm start
```

Para generar el artefacto de producción:

```bash
npm run build
```

La salida se crea en `www/`.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` compila y publica
automáticamente cada push a `main`. Calcula el `base-href` usando el nombre real
del repositorio y genera un fallback `404.html` para conservar el enrutamiento
de la SPA al recargar una ruta interna.

En GitHub, selecciona **Settings → Pages → Source → GitHub Actions**. Después
ejecuta el workflow manualmente o haz push a `main`.

### Apariencia de aplicación

Kuichi incluye un manifiesto web, modo `standalone`, icono, colores del sistema
y un service worker básico. Una vez publicada mediante HTTPS en GitHub Pages:

- En Android/Chrome: abre el menú y selecciona **Instalar aplicación**.
- En iPhone/Safari: pulsa **Compartir → Añadir a pantalla de inicio**.
- En escritorio/Chrome o Edge: usa el icono **Instalar** de la barra de
  direcciones.

Al abrirla desde el icono instalado no se muestra la barra del navegador, por lo
que se comporta visualmente como una aplicación móvil.

## Stack

Ionic 8, Angular 20, Capacitor 7, TypeScript y Firebase.

## Alcance de la demo

La sesión demo usa almacenamiento local y datos de muestra. Las funciones que
dependen del dispositivo (cámara, geolocalización y llamadas) están disponibles
según los permisos y capacidades del navegador o del dispositivo.
