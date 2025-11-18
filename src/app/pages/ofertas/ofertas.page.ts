import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { pricetag, gift, flash, call, addCircle, documentText, add, trash, home, paw, logOut } from 'ionicons/icons';

export interface Oferta {
  id: string;
  titulo: string;
  descripcion: string;
  createdAt: number;
}

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage {
  nuevaOferta: { titulo: string; descripcion: string } = {
    titulo: '',
    descripcion: ''
  };

  ofertas: Oferta[] = [];
  private key = 'kuichi_ofertas_v1';

  // Iconos para las ofertas
  private ofertaIcons = [
    'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=100&h=100&fit=crop&crop=center', // Veterinario
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop&crop=center', // Mascotas
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop&crop=center', // Perro
    'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=100&h=100&fit=crop&crop=center', // Gato
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop&crop=center', // Cuidado
  ];

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    @Inject(AuthService) private auth: AuthService
  ) {
    addIcons({ pricetag, gift, flash, call, addCircle, documentText, add, trash, home, paw, logOut });
    this.loadOfertas();
  }

  private loadOfertas() {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        this.ofertas = JSON.parse(stored);
      } else {
        // Ofertas por defecto solo la primera vez
        this.ofertas = [
          { 
            id: '1',
            titulo: 'Descuento en Vacunas 💉', 
            descripcion: '20% de descuento en todas las vacunas durante este mes. Válido para perros y gatos.',
            createdAt: Date.now() - 86400000 // 1 día atrás
          },
          { 
            id: '2',
            titulo: 'Control Dental Gratuito 🦷', 
            descripcion: 'Revisión dental completa sin costo. Incluye limpieza básica y diagnóstico.',
            createdAt: Date.now() - 172800000 // 2 días atrás
          },
          { 
            id: '3',
            titulo: 'Consulta de Emergencia 🚨', 
            descripcion: 'Atención veterinaria de emergencia 24/7 con 15% de descuento.',
            createdAt: Date.now() - 259200000 // 3 días atrás
          }
        ];
        this.saveOfertas();
      }
    } catch {
      this.ofertas = [];
    }
  }

  private saveOfertas() {
    localStorage.setItem(this.key, JSON.stringify(this.ofertas));
  }

  async agregarOferta() {
    if (!this.nuevaOferta.titulo || !this.nuevaOferta.descripcion) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    const nuevaOferta: Oferta = {
      id: Date.now().toString(),
      titulo: this.nuevaOferta.titulo,
      descripcion: this.nuevaOferta.descripcion,
      createdAt: Date.now()
    };

    this.ofertas.unshift(nuevaOferta);
    this.nuevaOferta = { titulo: '', descripcion: '' };
    this.saveOfertas();
    
    await this.showToast('¡Oferta publicada exitosamente!', 'success');
    this.scrollToTop();
  }

  async confirmarEliminar(oferta: Oferta) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar eliminación';
    alert.message = `¿Estás seguro de que quieres eliminar la oferta "${oferta.titulo}"?`;
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.eliminarOferta(oferta);
        }
      }
    ];
    
    document.body.appendChild(alert);
    await alert.present();
  }

  async eliminarOferta(oferta: Oferta) {
    this.ofertas = this.ofertas.filter(o => o.id !== oferta.id);
    this.saveOfertas();
    await this.showToast('Oferta eliminada', 'danger');
  }

  getOfertaIcon(index: number): string {
    return this.ofertaIcons[index % this.ofertaIcons.length];
  }

  scrollToForm() {
    const element = document.querySelector('.add-offer-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  async logout() {
    this.auth.logout();
    await this.router.navigateByUrl('/');
    await this.showToast('Sesión cerrada', 'primary');
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}