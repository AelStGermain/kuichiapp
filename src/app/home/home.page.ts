// src/app/home/home.page.ts

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  // Componentes requeridos para el Header y Core
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonButtons,

  // Componentes del Cuerpo (Mantengo para evitar errores si el HTML los usa)
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,

} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logIn, mail, lockClosed, informationCircle, flash, person,
  paw, pin, logOutOutline, logInOutline, camera, location, heart, pricetag,
  checkmarkCircle
} from 'ionicons/icons';

// 🚨 RUTA CORREGIDA: Se asume que el servicio está en '../services/auth.service'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    // Imports mínimos para el Header/Core
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,

    // Imports del Dashboard
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
  ],
})
export class HomePage implements OnInit {

  // Inyección de dependencias
  private router = inject(Router);
  private authService = inject(AuthService);

  // Propiedades definidas para el template HTML
  isLoggedIn: boolean = false;
  currentPath: string = '';

  // Estadísticas para el dashboard
  totalMascotas: number = 0;
  totalVeterinarias: number = 0;
  totalOfertas: number = 0;

  constructor() {
    // Registro de todos los iconos usados
    addIcons({
      logIn, mail, lockClosed, informationCircle, flash, person,
      paw, pin, logOutOutline, logInOutline, camera, location, heart, pricetag,
      checkmarkCircle
    });
  }

  ngOnInit() {
    // Suscripción al estado de autenticación del servicio (Observable)
    this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
      if (isAuthenticated) {
        this.loadStatistics();
      }
    });
    // Obtiene la ruta actual para la lógica condicional del Login/Logout
    this.currentPath = this.router.url;
  }

  /**
   * Carga las estadísticas desde localStorage para mostrar en el dashboard
   */
  loadStatistics() {
    try {
      // Cargar mascotas
      const mascotasData = localStorage.getItem('kuichi_mascotas_v1');
      this.totalMascotas = mascotasData ? JSON.parse(mascotasData).length : 0;

      // Cargar veterinarias
      const veterinariasData = localStorage.getItem('kuichi_veterinarias_v1');
      this.totalVeterinarias = veterinariasData ? JSON.parse(veterinariasData).length : 0;

      // Cargar ofertas (asumiendo que existe un storage similar)
      const ofertasData = localStorage.getItem('kuichi_ofertas_v1');
      this.totalOfertas = ofertasData ? JSON.parse(ofertasData).length : 0;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  /**
   * Navega a una URL específica.
   */
  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  /**
   * 🔒 Cierra la sesión del usuario y redirige al login.
   */
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Navega a una ruta dentro de tabs
   */
  navigateToTab(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}