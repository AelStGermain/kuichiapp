// src/app/main.ts (CÓDIGO CORREGIDO Y COMPLETO)

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';

// Importación obligatoria del motor de web components de Ionic
// Esto garantiza que el runtime de Ionic se cargue antes de que Angular intente renderizar <ion-app>
// import '@ionic/core/components';

import { environment } from './environments/environment';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Módulo de formularios también debe importarse

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // La estrategia de ruteo de Ionic debe ir aquí.
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Provee el router con las rutas de la app.
    provideRouter(routes),

    // Provee el cliente HTTP (necesario para la comunicación con el backend).
    provideHttpClient(),

    // Importa el módulo de Ionic y otros módulos básicos.
    importProvidersFrom(IonicModule.forRoot({}), FormsModule),

    // Inicialización de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
}).then(() => {
  if (environment.production && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(error => {
      console.warn('No se pudo registrar el modo offline.', error);
    });
  }
});
