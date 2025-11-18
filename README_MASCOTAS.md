# 🐾 Kuichi - Aplicación de Gestión de Mascotas

Una aplicación móvil desarrollada con **Ionic Angular** que utiliza **periféricos del dispositivo** para gestionar mascotas de forma completa.

## 📱 Periféricos Utilizados

### 1. 📷 CÁMARA
- **Funcionalidad**: Capturar fotos de las mascotas
- **Implementación**: `@capacitor/camera`
- **Uso**: Cada mascota puede tener una foto asociada que se muestra en la lista
- **Características**:
  - Calidad 90% para optimizar almacenamiento
  - Captura directa desde cámara
  - Previsualización inmediata
  - Almacenamiento local en base64

### 2. 🗺️ GPS / GEOLOCALIZACIÓN
- **Funcionalidad**: Encontrar veterinarias cercanas
- **Implementación**: `@capacitor/geolocation`
- **Uso**: Localizar servicios veterinarios basados en ubicación actual
- **Características**:
  - Alta precisión GPS
  - Búsqueda automática de veterinarias
  - Integración con Google Maps
  - Llamadas directas a veterinarias

## 🚀 Funcionalidades Principales

### Gestión de Mascotas
- ✅ Registrar nuevas mascotas (nombre, especie, edad, notas)
- ✅ Editar información existente
- ✅ Eliminar mascotas
- ✅ **Tomar fotos** con la cámara del dispositivo
- ✅ Visualizar fotos en la lista de mascotas

### Servicios Veterinarios
- ✅ **Obtener ubicación GPS** actual
- ✅ Buscar veterinarias cercanas automáticamente
- ✅ Ver distancia a cada veterinaria
- ✅ Abrir ubicación en Google Maps
- ✅ Llamar directamente a las veterinarias

## 🛠️ Tecnologías y Dependencias

```json
{
  "@capacitor/camera": "^7.0.2",
  "@capacitor/geolocation": "^7.1.5",
  "@ionic/angular": "^8.0.0",
  "@angular/core": "^20.0.0"
}
```

## 📋 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Sincronizar Capacitor
```bash
ionic cap sync
```

### 3. Ejecutar en dispositivo Android
```bash
ionic cap run android
```

## 🔧 Configuración de Permisos

La aplicación solicita automáticamente:

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## 📱 Uso de la Aplicación

### Agregar Mascota con Foto
1. Completar formulario (nombre, especie, edad, notas)
2. Presionar "Tomar Foto de la Mascota"
3. Permitir acceso a cámara
4. Capturar foto
5. Guardar mascota

### Buscar Veterinarias
1. Ir a sección "Veterinarias Cercanas"
2. Presionar "Buscar Veterinarias Cercanas"
3. Permitir acceso a ubicación
4. Ver lista de veterinarias ordenadas por distancia
5. Llamar o ver en mapa

## 🎯 Cumplimiento de Requisitos Académicos

### ✅ Uso de Periféricos
- **Cámara**: Implementada para capturar fotos de mascotas
- **GPS**: Implementado para geolocalización y búsqueda de servicios

### ✅ Funcionalidad Práctica
- **Gestión completa**: CRUD de mascotas con fotos
- **Servicios útiles**: Localización de veterinarias cercanas
- **Integración nativa**: Uso real de hardware del dispositivo

### ✅ Tecnologías Modernas
- **Ionic 8**: Framework híbrido actualizado
- **Angular 20**: Framework web robusto
- **Capacitor 7**: Acceso nativo a periféricos
- **TypeScript**: Tipado fuerte y moderno

## 🔍 Estructura del Código

### Componente Principal
```typescript
// src/app/pages/mascotas/mascotas.page.ts
export class MascotasPage {
  // Cámara
  async tomarFoto() { ... }
  
  // GPS
  async obtenerUbicacion() { ... }
  async buscarVeterinarias() { ... }
}
```

### Modelo de Datos
```typescript
// src/app/models/mascota.model.ts
export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  foto?: string;  // Base64 de la imagen
  // ... otros campos
}
```

## 🧪 Pruebas y Validación

### Probar Cámara
1. Ejecutar en dispositivo físico o emulador con cámara
2. Verificar permisos de cámara
3. Capturar foto y verificar almacenamiento

### Probar GPS
1. Activar servicios de ubicación
2. Probar en exterior para mejor señal GPS
3. Verificar precisión de coordenadas

## 📞 Soporte Técnico

### Problemas Comunes

**Error de cámara:**
```bash
# Verificar permisos en configuración del dispositivo
# Reinstalar si es necesario
ionic cap sync android
```

**Error de GPS:**
```bash
# Activar ubicación en configuración
# Probar en exterior
# Verificar conexión a internet
```

## 🎓 Evaluación Académica

Esta aplicación demuestra:
- ✅ **Uso efectivo de periféricos** (cámara y GPS)
- ✅ **Aplicación práctica y útil** (gestión de mascotas)
- ✅ **Integración nativa** con hardware del dispositivo
- ✅ **Código limpio y documentado**
- ✅ **Tecnologías actuales** del desarrollo móvil

---

**Desarrollado para cumplir requisitos académicos de uso de periféricos en aplicaciones móviles** 🎯