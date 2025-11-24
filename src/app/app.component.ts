// src/app/app.component.ts (VERSION DE PRUEBA: SIN LÓGICA DE AUTH)

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
// Eliminamos la dependencia de Router y AuthService temporalmente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule // Necesario si el HTML usa routerLink
  ],
  // Dejamos schemas por ahora, no molestan
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  
  // Añadimos propiedades dummy para que el HTML no falle.
  // 💡 Dejamos 'true' para forzar que los iconos de navegación/logout sean visibles.
  isAuth: boolean = true; 
  
  constructor() {
    // Si necesitas inicializar algo base, lo pones aquí.
  }
  
  logout() {
    console.log('Logout desactivado para prueba de renderizado.');
  }
}