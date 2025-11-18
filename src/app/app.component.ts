// src/app/app.component.ts (VERSION DE PRUEBA: SIN LÓGICA DE AUTH)

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
// Eliminamos la dependencia de Router y AuthService temporalmente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  // Dejamos schemas por ahora, no molestan
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Eliminamos el constructor y las funciones relacionadas con AuthService
  // Si la app carga, el problema está en AuthService/Router en la inicialización.
  
  // Añadimos propiedades dummy para que el HTML no falle.
  isAuth: boolean = false; 
  
  constructor() {
    // Si necesitas inicializar algo base, lo pones aquí.
  }
  
  logout() {
    console.log('Logout desactivado para prueba de renderizado.');
  }
}