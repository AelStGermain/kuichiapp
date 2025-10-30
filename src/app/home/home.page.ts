import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  usuario = { email: '', password: '' };
  redirectAfterLogin = '/mascotas';

  constructor(
    @Inject(AuthService) private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  async login() {
    if (!this.usuario.email || !this.usuario.password) {
      const t = await this.toast.create({ message: 'Completa email y contraseña', duration: 1200, color: 'warning' });
      await t.present();
      return;
    }
    const ok = this.auth.login(this.usuario.email, this.usuario.password);
    if (ok) {
      const url = this.router.parseUrl(this.router.url);
      const redirect = url.queryParams['redirect'] || this.redirectAfterLogin;
      await this.router.navigateByUrl(redirect);
    } else {
      const t = await this.toast.create({ message: 'Credenciales inválidas', duration: 1200, color: 'danger' });
      await t.present();
    }
  }
}
