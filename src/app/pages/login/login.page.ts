import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonItem, 
  IonInput, 
  IonButton,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { logIn, mail, lockClosed, informationCircle, flash, person } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonItem,
    IonInput,
    IonButton,
  ],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private alertController = inject(AlertController);

  usuario = { email: '', password: '' };
  private redirectUrl: string | null = null;

  constructor() {
    addIcons({ logIn, mail, lockClosed, informationCircle, flash, person });
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.redirectUrl = params.get('redirect');
    });
  }

  async login() {
    const success = await this.authService.login(this.usuario.email, this.usuario.password);
    if (success) {
      this.router.navigateByUrl(this.redirectUrl || '/mascotas');
    } else {
      const alert = await this.alertController.create({
        header: 'Error de Acceso',
        message: 'El email no es válido o no se encontró. Por favor, inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  quickLogin() {
    this.usuario.email = 'Sincere@april.biz';
    this.usuario.password = 'password'; // La contraseña puede ser cualquiera
    this.login();
  }
}