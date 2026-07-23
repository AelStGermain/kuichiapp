import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { addIcons } from 'ionicons';
import { pricetag, gift, flash, logoWhatsapp, addCircle, documentText, add, trash, home, paw, logOut, create, close, checkmark } from 'ionicons/icons';
import { Observable } from 'rxjs';

export interface Oferta {
  id: string;
  titulo: string;
  descripcion: string;
  proveedor: string;
  whatsapp: string;
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

  // Estado de edición
  editandoOferta: Oferta | null = null;
  modoEdicion = false;

  // Observable para verificar si el usuario es admin
  isAdmin$: Observable<boolean>;

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
    @Inject(AuthService) private auth: AuthService,
    private storage: StorageService
  ) {
    addIcons({ pricetag, gift, flash, logoWhatsapp, addCircle, documentText, add, trash, home, paw, logOut, create, close, checkmark });
    this.isAdmin$ = this.auth.isAdmin();
    this.loadOfertas();
  }

  private loadOfertas() {
    const uid = this.auth.getCurrentUserId();
    if (!uid) {
      this.ofertas = [];
      return;
    }

    const key = `kuichi_ofertas_${uid}`;
    const stored = this.storage.get<Oferta[]>(key);

    if (stored && stored.length > 0) {
      this.ofertas = stored.map((oferta, index) => ({
        ...oferta,
        proveedor: oferta.proveedor || 'Centro veterinario asociado',
        whatsapp: oferta.whatsapp || `5695555010${index + 1}`
      }));
    } else {
      // Ofertas por defecto solo la primera vez
      this.ofertas = [
        {
          id: '1',
          titulo: 'Descuento en Vacunas 💉',
          descripcion: '20% de descuento en todas las vacunas durante este mes. Válido para perros y gatos.',
          proveedor: 'Clínica Huellitas',
          whatsapp: '56955550101',
          createdAt: Date.now() - 86400000
        },
        {
          id: '2',
          titulo: 'Control Dental Gratuito 🦷',
          descripcion: 'Revisión dental completa sin costo. Incluye limpieza básica y diagnóstico.',
          proveedor: 'VetCare Ñuñoa',
          whatsapp: '56955550102',
          createdAt: Date.now() - 172800000
        },
        {
          id: '3',
          titulo: 'Consulta de Emergencia 🚨',
          descripcion: 'Atención veterinaria de emergencia 24/7 con 15% de descuento.',
          proveedor: 'Urgencias Animal 24/7',
          whatsapp: '56955550103',
          createdAt: Date.now() - 259200000
        }
      ];
      this.saveOfertas();
    }
  }

  private saveOfertas() {
    const uid = this.auth.getCurrentUserId();
    if (uid) {
      const key = `kuichi_ofertas_${uid}`;
      this.storage.set(key, this.ofertas);
    }
  }

  async agregarOferta() {
    if (!this.nuevaOferta.titulo || !this.nuevaOferta.descripcion) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    if (this.modoEdicion && this.editandoOferta) {
      // MODO EDICIÓN
      const index = this.ofertas.findIndex(o => o.id === this.editandoOferta!.id);
      if (index > -1) {
        this.ofertas[index] = {
          ...this.editandoOferta,
          titulo: this.nuevaOferta.titulo,
          descripcion: this.nuevaOferta.descripcion
        };
        await this.showToast('¡Oferta actualizada exitosamente!', 'success');
      }
      this.modoEdicion = false;
      this.editandoOferta = null;
    } else {
      // MODO CREACIÓN
      const nuevaOferta: Oferta = {
        id: Date.now().toString(),
        titulo: this.nuevaOferta.titulo,
        descripcion: this.nuevaOferta.descripcion,
        proveedor: 'Centro veterinario Kuichi',
        whatsapp: '56955550100',
        createdAt: Date.now()
      };
      this.ofertas.unshift(nuevaOferta);
      await this.showToast('¡Oferta publicada exitosamente!', 'success');
    }

    this.nuevaOferta = { titulo: '', descripcion: '' };
    this.saveOfertas();
    this.scrollToTop();
  }

  iniciarEdicion(oferta: Oferta) {
    this.editandoOferta = oferta;
    this.modoEdicion = true;
    this.nuevaOferta = {
      titulo: oferta.titulo,
      descripcion: oferta.descripcion
    };
    this.scrollToForm();
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.editandoOferta = null;
    this.nuevaOferta = { titulo: '', descripcion: '' };
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

  contactar(oferta: Oferta) {
    const mensaje = encodeURIComponent(
      `Hola, vi la oferta "${oferta.titulo}" en Kuichi y quisiera conocer más detalles.`
    );
    window.open(`https://wa.me/${oferta.whatsapp}?text=${mensaje}`, '_blank', 'noopener,noreferrer');
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
