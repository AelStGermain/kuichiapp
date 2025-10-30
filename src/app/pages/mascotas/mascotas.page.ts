import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export type Mascota = {
  id: string;
  nombre: string;
  especie: string;
  edad?: string;
  notas?: string;
  createdAt: number;
};

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
})
export class MascotasPage {
  mascotas: Mascota[] = [];
  form: Partial<Mascota> = {};
  editingId: string | null = null;

  private key = 'kuichi_mascotas_v1';

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    @Inject(AuthService) private auth: AuthService
  ) {
    this.load();
  }

  // getter para template: true si hay usuario autenticado
  get isAuth(): boolean {
    try { return this.auth.isAuthenticated(); } catch { return false; }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      this.mascotas = raw ? JSON.parse(raw) : [];
    } catch {
      this.mascotas = [];
    }
  }

  saveStore() {
    localStorage.setItem(this.key, JSON.stringify(this.mascotas));
  }

  startCreate() {
    this.editingId = null;
    this.form = { nombre: '', especie: '', edad: '', notas: '' };
    this.scrollToTop();
  }

  addOrUpdate() {
    if (!this.form.nombre || !this.form.especie) {
      this.showToast('Nombre y especie son obligatorios', 'warning');
      return;
    }

    if (this.editingId) {
      const i = this.mascotas.findIndex(m => m.id === this.editingId);
      if (i > -1) {
        this.mascotas[i] = {
          ...this.mascotas[i],
          nombre: this.form.nombre!,
          especie: this.form.especie!,
          edad: this.form.edad || '',
          notas: this.form.notas || '',
          createdAt: this.mascotas[i].createdAt,
        };
        this.showToast('Mascota actualizada', 'success');
      }
      this.editingId = null;
    } else {
      const nueva: Mascota = {
        id: Date.now().toString(),
        nombre: this.form.nombre!,
        especie: this.form.especie!,
        edad: this.form.edad || '',
        notas: this.form.notas || '',
        createdAt: Date.now(),
      };
      this.mascotas.unshift(nueva);
      this.showToast('Mascota agregada', 'success');
    }
    this.form = {};
    this.saveStore();
    this.scrollToList();
  }

  edit(m: Mascota) {
    this.editingId = m.id;
    this.form = { nombre: m.nombre, especie: m.especie, edad: m.edad, notas: m.notas };
    this.scrollToTop();
  }

  remove(id: string) {
    this.mascotas = this.mascotas.filter(m => m.id !== id);
    this.saveStore();
    this.showToast('Mascota eliminada', 'danger');
  }

  clearAll() {
    this.mascotas = [];
    this.saveStore();
    this.showToast('Todas las mascotas eliminadas', 'danger');
  }

  async logout() {
    this.auth.logout();
    await this.router.navigateByUrl('/');
    this.showToast('Sesión cerrada', 'primary');
  }

  private async showToast(msg: string, color: string = 'primary') {
    const t = await this.toastCtrl.create({ message: msg, duration: 1400, color });
    t.present();
  }

  private scrollToTop() {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  private scrollToList() {
    setTimeout(() => {
      const el = document.querySelector('#mascotas-list');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}
