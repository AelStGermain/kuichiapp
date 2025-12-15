# Preguntas y Respuestas para la Defensa del Proyecto Kuichi

Este documento recopila las preguntas más probables que un profesor de desarrollo móvil podría realizar sobre el proyecto Kuichi, junto con respuestas técnicas detalladas y ejemplos del código real.

---

## 1. ¿Cómo funcionan los CRUD en este proyecto?

**Respuesta General:**
El proyecto implementa operaciones CRUD (Create, Read, Update, Delete) utilizando dos estrategias principales dependiendo del tipo de dato: **Firestore** para datos compartidos (como Veterinarias) y **Almacenamiento Local Sincronizado** para datos privados del usuario (como Mascotas).

**Detalle Técnico:**

*   **Veterinarias (Firestore):**
    Utilizamos el SDK modular de Firebase (`@angular/fire/firestore`). El `VeterinariaService` inyecta la instancia de `Firestore` y utiliza funciones directas como `collection`, `addDoc`, `updateDoc` y `deleteDoc`.
    
    *Ejemplo de Lectura (Read):*
    Se utiliza `collectionData` que retorna un `Observable`, permitiendo que la UI se actualice en tiempo real si los datos cambian en el servidor.
    ```typescript
    // src/app/services/veterinaria.service.ts
    getVeterinarias(): Observable<Veterinaria[]> {
      const veterinariasRef = collection(this.firestore, this.collectionName);
      return collectionData(veterinariasRef, { idField: 'id' }) as Observable<Veterinaria[]>;
    }
    ```

*   **Mascotas (Local + Sync):**
    Para las mascotas, implementamos un patrón de "Offline First". Las operaciones CRUD ocurren primero en memoria y se persisten localmente. El `SyncService` actúa como intermediario, simulando una sincronización con una API externa (JSONPlaceholder) y guardando el estado final en `localStorage` de forma encriptada.

---

## 2. ¿Cómo funciona la persistencia de datos? ¿LocalStorage?

**Respuesta General:**
La persistencia local es crítica para la experiencia de usuario. No guardamos datos en texto plano; implementamos una capa de seguridad sobre `localStorage` mediante un servicio dedicado: `StorageService`.

**Detalle Técnico:**
El `StorageService` utiliza la librería `crypto-js` para encriptar (AES) cualquier dato antes de guardarlo y desencriptarlo al leerlo. Esto asegura que si alguien accede físicamente al dispositivo o al navegador, no pueda leer los datos sensibles del usuario (como sus mascotas) simplemente inspeccionando el almacenamiento.

*   **Clave de Encriptación:** Se utiliza una constante `SECRET_KEY` (en producción debería venir de variables de entorno).
*   **Aislamiento de Usuario:** Las claves en el storage incluyen el UID del usuario (ej. `kuichi_mascotas_USER123`), garantizando que si otro usuario inicia sesión en el mismo dispositivo, no vea los datos del anterior.

*Código clave:*
```typescript
// src/app/services/storage.service.ts
set(key: string, value: any): void {
    const jsonValue = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(jsonValue, this.SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
}
```

---

## 3. ¿Cómo funciona el login y el sistema de autorización?

**Respuesta General:**
La autenticación se delega completamente a **Firebase Authentication**, lo que nos provee un manejo de sesiones robusto y seguro. La autorización (protección de rutas) se maneja mediante **Angular Guards**.

**Detalle Técnico:**

1.  **AuthService:**
    *   Utiliza `AngularFireAuth`.
    *   Expone un `authState$` (Observable) que emite el usuario actual o `null`.
    *   Mantiene un `BehaviorSubject` (`_isAuthenticated`) para tener un estado síncrono disponible para componentes que lo requieran inmediatamente.

2.  **Login:**
    *   Soportamos Email/Password (`signInWithEmailAndPassword`) y Google Sign-In (`signInWithPopup`).

3.  **Guards (Autorización):**
    *   El `AuthGuard` verifica si el usuario está autenticado antes de permitir la navegación a rutas protegidas (como `/home` o `/mascotas`). Si no lo está, redirige al login.

*Código clave:*
```typescript
// src/app/services/auth.service.ts
public readonly authState$: Observable<User | null> = authState(this.auth);

// Login con Google
async loginWithGoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    return true;
}
```

---

## 4. ¿Cómo implementaste Firebase?

**Respuesta General:**
Firebase se integra en el proyecto utilizando la librería oficial `@angular/fire`, que provee wrappers idiomáticos de Angular (Observables, Inyección de Dependencias) sobre el SDK de JavaScript de Firebase.

**Detalle Técnico:**
La configuración se realiza en el `app.module.ts` (o `app.config.ts` en standalone), donde inicializamos la app con `provideFirebaseApp` y los servicios específicos como `provideAuth` y `provideFirestore`.

*   **Modularidad:** Solo importamos las funciones que necesitamos (Tree Shaking), lo que optimiza el tamaño del bundle final.
*   **Reactividad:** Aprovechamos la naturaleza reactiva de Firestore. Al usar `collectionData`, nuestra vista se suscribe a los cambios de la base de datos. Si un administrador agrega una veterinaria desde otro lugar, la app la muestra instantáneamente sin recargar.

---

## 5. ¿Cómo implementaste la seguridad?

**Respuesta General:**
La seguridad se aborda en múltiples capas: Tránsito, Almacenamiento y Acceso.

**Detalle Técnico:**

1.  **Seguridad en Tránsito:** Todas las comunicaciones con Firebase y APIs externas ocurren sobre HTTPS.
2.  **Seguridad en Almacenamiento (Data at Rest):**
    *   Como mencionamos, el `StorageService` encripta los datos locales con AES.
    *   Los datos sensibles no quedan expuestos en `localStorage`.
3.  **Control de Acceso (Auth):**
    *   Uso de Guards para prevenir navegación no autorizada.
    *   Aislamiento de datos: El `SyncService` usa el UID del usuario para prefijar las claves de almacenamiento (`kuichi_mascotas_${uid}`), asegurando que cada usuario tenga su propio "silo" de datos.
4.  **Validación de Tipos:** Uso estricto de Interfaces TypeScript (`Mascota`, `Veterinaria`) para asegurar la integridad de los datos que fluyen por la app.

---

## Preguntas Adicionales (Bonus)

Aquí hay otras preguntas que el profesor podría hacer para evaluar profundidad técnica:

### 6. ¿Por qué usas Observables y RxJS en lugar de solo Promesas?
**Respuesta:**
Angular está construido sobre RxJS. Los Observables nos permiten manejar flujos de datos en el tiempo (como el estado de autenticación o actualizaciones de Firestore) de manera declarativa. A diferencia de las Promesas que se resuelven una sola vez, un Observable puede emitir múltiples valores, lo cual es ideal para una app reactiva donde los datos pueden cambiar en cualquier momento.

### 7. ¿Qué es la Inyección de Dependencias y dónde la usas?
**Respuesta:**
Es un patrón de diseño donde los objetos reciben sus dependencias en lugar de crearlas ellos mismos. En Angular, esto se ve en los constructores o usando `inject()`.
*   *Ejemplo:* `VeterinariaService` no crea una instancia de `Firestore` con `new Firestore()`, sino que la pide al sistema de inyección de Angular (`private firestore: Firestore = inject(Firestore)`). Esto hace que el código sea más modular y fácil de testear (podemos inyectar un Mock de Firestore en las pruebas).

### 8. Explícame el ciclo de vida de un componente que hayas usado.
**Respuesta:**
En `MascotasPage` (o similar), usamos `ngOnInit` para inicializar la carga de datos. Es el lugar seguro para llamar a servicios una vez que los inputs del componente están listos. También usamos `ngOnDestroy` (si nos suscribimos manualmente) para limpiar suscripciones y evitar fugas de memoria (memory leaks).

### 9. ¿Cómo manejas los errores en las peticiones HTTP?
**Respuesta:**
En el `ApiService`, utilizamos el operador `catchError` de RxJS dentro del `pipe`. Esto nos permite interceptar el error, loguearlo en consola o enviarlo a un servicio de monitoreo, y luego retornar un valor seguro o relanzar el error de una manera controlada para que la UI pueda mostrar un mensaje amigable al usuario.

### 10. ¿Qué es el patrón "Offline First" que mencionaste?
**Respuesta:**
Es una estrategia donde la app funciona primero con los datos locales y luego intenta sincronizar con la red. En nuestro `SyncService`, cuando el usuario guarda una mascota, primero actualizamos el estado local y la UI responde inmediatamente. Luego, en segundo plano (o cuando haya red), sincronizamos con el servidor. Esto mejora la percepción de velocidad y permite usar la app sin internet.
