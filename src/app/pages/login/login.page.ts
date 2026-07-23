import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logInOutline, personOutline, lockClosedOutline, arrowForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonInput, IonButton, IonIcon, IonSpinner
  ]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado del formulario
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor() {
    addIcons({ logoGoogle, logInOutline, personOutline, lockClosedOutline, arrowForwardOutline });
  }

  enterDemo() {
    this.authService.loginAsDemo();
    this.router.navigate(['/tabs/home']);
  }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/tabs/home']);
      } else {
        this.errorMessage = 'Credenciales incorrectas.';
      }
    } catch (e) {
      this.errorMessage = 'Ocurrió un error inesperado.';
    } finally {
      this.isLoading = false;
    }
  }

  async loginGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.loginWithGoogle();
      if (success) {
        this.router.navigate(['/tabs/home']);
      } else {
        this.errorMessage = 'No se pudo iniciar sesión con Google.';
      }
    } catch (e) {
      this.errorMessage = 'Error de conexión con Google.';
    } finally {
      this.isLoading = false;
    }
  }
}
