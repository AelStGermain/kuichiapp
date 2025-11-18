// src/app/home/home.page.ts (Código MEJORADO)

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  IonLabel,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
  // IonInput eliminado ya que no se usa en el HTML
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { logIn, mail, lockClosed, informationCircle, flash, person, camera, location, heart, pricetag, home, paw, logOut } from 'ionicons/icons'; // Añadidos home, paw, logOut

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonLabel,
    IonChip,
    IonGrid,
    IonRow,
    IonCol
    // IonInput eliminado de aquí también
  ],
})
export class HomePage {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Modelo de usuario para login (aunque no se usa en este HTML, es bueno mantenerlo)
  usuario = { email: '', password: '' }; 

  constructor() {
    // Es crucial que todos los iconos usados en toda la app estén cargados aquí.
    addIcons({ 
      logIn, mail, lockClosed, informationCircle, flash, person, 
      camera, location, heart, pricetag, 
      // Iconos usados en app.component.html:
      home, paw, logOut 
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  
  async login() {
    console.log('Intento de Login:', this.usuario);
    const ok = await this.authService.login(this.usuario.email, this.usuario.password);
    if (ok) {
        this.router.navigate(['/mascotas']);
    } else {
        // Manejo de error
    }
  }

  async quickLogin() {
    this.usuario.email = 'Sincere@april.biz';
    this.usuario.password = 'azerty'; 
    await this.login();
  }
}