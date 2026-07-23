import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SyncService, SyncState } from '../../services/sync.service';
import { StorageService } from '../../services/storage.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import QRCode from 'qrcode';
import { addIcons } from 'ionicons';
import { cameraOutline, locationOutline, mapOutline, paw, home, pricetag, logOut, add, create, checkmark, close, fish, time, documentText, camera, heart, medical, call, map, checkmarkCircle, trash, images, cloudUpload, cloudDownload, sync, cloudDone, qrCodeOutline, shareSocialOutline, alertCircleOutline, shieldCheckmarkOutline, calendarOutline } from 'ionicons/icons';

export type Mascota = {
  id: string;
  nombre: string;
  especie: string;
  edad?: string;
  notas?: string;
  vacunasAlDia?: boolean;
  proximoControl?: string;
  perdida?: boolean;
  createdAt: number;
  foto?: string;
  syncStatus?: 'pending' | 'synced' | 'error';
  lastSyncedAt?: number;
  remoteId?: string;
};

export interface Veterinaria {
  nombre: string;
  direccion: string;
  telefono?: string;
  distancia: number;
  lat: number;
  lng: number;
}

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
  showForm = false;
  expandedPassportId: string | null = null;
  passportQr: Record<string, string> = {};

  // Cámara
  fotoCapturada: string | undefined;

  // GPS y Veterinarias
  ubicacionActual: { lat: number; lng: number } | null = null;
  veterinarias: Veterinaria[] = [];
  buscandoVeterinarias = false;
  obteniendoUbicacion = false;

  // Sincronización
  syncState: SyncState = { status: 'idle', lastSyncedAt: null, message: '' };




  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    @Inject(AuthService) private auth: AuthService,
    private syncService: SyncService,
    private storage: StorageService
  ) {
    addIcons({
      cameraOutline, locationOutline, mapOutline, paw, home, pricetag, logOut,
      add, create, checkmark, close, fish, time, documentText, camera, heart,
      medical, call, map, checkmarkCircle, trash, images, cloudUpload, cloudDownload,
      sync, cloudDone
      , qrCodeOutline, shareSocialOutline, alertCircleOutline, shieldCheckmarkOutline, calendarOutline
    });
    this.load();

    // Suscribirse a cambios de estado de sincronización
    this.syncService.syncState$.subscribe(state => {
      this.syncState = state;
    });

    // Suscribirse a cambios de autenticación para recargar datos
    this.auth.authState$.subscribe(user => {
      this.load();
    });
  }

  // getter para template: true si hay usuario autenticado
  get isAuth(): boolean {
    try { return this.auth.isAuthenticated(); } catch { return false; }
  }

  load() {
    const uid = this.auth.getCurrentUserId();
    if (!uid) {
      this.mascotas = [];
      return;
    }

    const key = `kuichi_mascotas_${uid}`;
    const stored = this.storage.get<Mascota[]>(key);
    if (stored) {
      this.mascotas = stored;
      return;
    }

    this.mascotas = this.auth.isDemoSession() ? [
      {
        id: 'demo-luna',
        nombre: 'Luna',
        especie: 'Perro',
        edad: '4 años',
        notas: 'Vacunas al día · Próximo control en agosto',
        vacunasAlDia: true,
        proximoControl: '2026-08-18',
        foto: 'assets/images/hero-dog.png',
        createdAt: Date.now() - 86400000,
        syncStatus: 'synced'
      }
    ] : [];
    this.saveStore();
  }

  saveStore() {
    const uid = this.auth.getCurrentUserId();
    if (uid) {
      const key = `kuichi_mascotas_${uid}`;
      this.storage.set(key, this.mascotas);
    }
  }

  startCreate() {
    this.editingId = null;
    this.showForm = true;
    this.form = { nombre: '', especie: '', edad: '', notas: '', vacunasAlDia: false, proximoControl: '' };
    this.fotoCapturada = undefined;
    this.scrollToTop();
  }

  cancelForm() {
    this.editingId = null;
    this.showForm = false;
    this.form = {};
    this.fotoCapturada = undefined;
  }

  eliminarFoto() {
    this.fotoCapturada = undefined;
  }

  onImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center';
  }

  async confirmDelete(mascota: Mascota) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar eliminación';
    alert.message = `¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`;
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          this.remove(mascota.id);
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
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
          vacunasAlDia: !!this.form.vacunasAlDia,
          proximoControl: this.form.proximoControl || '',
          foto: this.fotoCapturada || this.mascotas[i].foto,
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
        vacunasAlDia: !!this.form.vacunasAlDia,
        proximoControl: this.form.proximoControl || '',
        foto: this.fotoCapturada,
        createdAt: Date.now(),
      };
      this.mascotas.unshift(nueva);
      this.showToast('Mascota agregada', 'success');
    }
    this.form = {};
    this.fotoCapturada = undefined;
    this.showForm = false;
    this.editingId = null;
    this.saveStore();
    this.scrollToList();
  }

  edit(m: Mascota) {
    this.editingId = m.id;
    this.showForm = true;
    this.form = {
      nombre: m.nombre,
      especie: m.especie,
      edad: m.edad,
      notas: m.notas,
      vacunasAlDia: m.vacunasAlDia,
      proximoControl: m.proximoControl
    };
    this.fotoCapturada = m.foto;
    this.scrollToTop();
  }

  async togglePassport(mascota: Mascota) {
    if (this.expandedPassportId === mascota.id) {
      this.expandedPassportId = null;
      return;
    }

    this.expandedPassportId = mascota.id;
    if (!this.passportQr[mascota.id]) {
      this.passportQr[mascota.id] = await QRCode.toDataURL(this.getPassportText(mascota), {
        width: 220,
        margin: 1,
        color: { dark: '#193c26', light: '#ffffff' }
      });
    }
  }

  async toggleLostMode(mascota: Mascota) {
    mascota.perdida = !mascota.perdida;
    this.saveStore();
    await this.showToast(
      mascota.perdida ? `Modo mascota perdida activado para ${mascota.nombre}` : 'Alerta desactivada',
      mascota.perdida ? 'warning' : 'success'
    );
  }

  async sharePassport(mascota: Mascota) {
    const text = this.getPassportText(mascota);
    if (navigator.share) {
      await navigator.share({ title: `Pasaporte de ${mascota.nombre}`, text });
      return;
    }

    await navigator.clipboard.writeText(text);
    await this.showToast('Pasaporte copiado para compartir', 'success');
  }

  private getPassportText(mascota: Mascota): string {
    const estado = mascota.perdida
      ? `ALERTA: ${mascota.nombre} está perdida. Si la encuentras, contacta a su familia desde Kuichi.`
      : `${mascota.nombre} cuenta con un pasaporte digital Kuichi.`;
    const vacunas = mascota.vacunasAlDia ? 'Vacunas al día' : 'Vacunas por revisar';
    const control = mascota.proximoControl ? `Próximo control: ${mascota.proximoControl}` : 'Sin próximo control registrado';
    return `${estado}\nEspecie: ${mascota.especie}\n${vacunas}\n${control}\nID: KUICHI-${mascota.id.toUpperCase()}`;
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

  // FUNCIONALIDAD DE CÁMARA
  async mostrarOpcionesFoto() {
    const actionSheet = document.createElement('ion-action-sheet');
    actionSheet.header = 'Seleccionar foto';
    actionSheet.buttons = [
      {
        text: 'Tomar foto',
        icon: 'camera',
        handler: () => {
          this.tomarFoto();
        }
      },
      {
        text: 'Elegir de galería',
        icon: 'images',
        handler: () => {
          this.seleccionarDeGaleria();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }
    ];

    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.fotoCapturada = image.dataUrl;
      this.showToast('Foto capturada correctamente', 'success');
    } catch (error) {
      console.error('Error al tomar foto:', error);
      this.showToast('Error al acceder a la cámara', 'danger');
    }
  }

  async seleccionarDeGaleria() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.fotoCapturada = image.dataUrl;
      this.showToast('Foto seleccionada correctamente', 'success');
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      this.showToast('Error al acceder a la galería', 'danger');
    }
  }

  // FUNCIONALIDAD DE GPS Y VETERINARIAS
  async obtenerUbicacion() {
    this.obteniendoUbicacion = true;
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.ubicacionActual = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.showToast('Ubicación obtenida', 'success');
      await this.buscarVeterinarias();
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      this.showToast('Error al obtener ubicación GPS', 'danger');
    } finally {
      this.obteniendoUbicacion = false;
    }
  }

  async buscarVeterinarias() {
    this.buscandoVeterinarias = true;

    // Simulamos veterinarias cercanas (en una app real usarías Google Places API)
    const veterinariasMock: Veterinaria[] = [
      {
        nombre: 'Veterinaria San Martín',
        direccion: 'Av. San Martín 1234',
        telefono: '(011) 4567-8901',
        distancia: 0.8,
        lat: -34.6037,
        lng: -58.3816
      },
      {
        nombre: 'Clínica Veterinaria Central',
        direccion: 'Calle Rivadavia 567',
        telefono: '(011) 4567-8902',
        distancia: 1.2,
        lat: -34.6050,
        lng: -58.3850
      },
      {
        nombre: 'Hospital de Mascotas',
        direccion: 'Av. Libertador 890',
        telefono: '(011) 4567-8903',
        distancia: 2.1,
        lat: -34.5990,
        lng: -58.3900
      }
    ];

    // Simular delay de búsqueda
    setTimeout(() => {
      this.veterinarias = veterinariasMock.sort((a, b) => a.distancia - b.distancia);
      this.buscandoVeterinarias = false;
      this.showToast(`${this.veterinarias.length} veterinarias encontradas`, 'success');
    }, 1500);
  }

  abrirEnMaps(vet: Veterinaria) {
    const url = `https://www.google.com/maps?q=${vet.lat},${vet.lng}`;
    window.open(url, '_blank');
  }

  llamarVeterinaria(telefono: string) {
    if (telefono) {
      window.open(`tel:${telefono}`, '_system');
    }
  }

  // ========== FUNCIONALIDADES DE SINCRONIZACIÓN CON API ==========

  /**
   * Sincroniza mascotas locales con el servidor remoto
   */
  async sincronizarConServidor() {
    if (this.mascotas.length === 0) {
      this.showToast('No hay mascotas para sincronizar', 'warning');
      return;
    }

    const success = await this.syncService.sincronizarMascotas(this.mascotas);

    if (success) {
      // Recargar mascotas con estado actualizado
      this.load();
      this.showToast('✅ Sincronización completada', 'success');
    } else {
      this.showToast('❌ Error en la sincronización', 'danger');
    }
  }

  /**
   * Importa mascotas desde API externa (JSONPlaceholder)
   */
  async importarDesdeAPI() {
    const mascotasImportadas = await this.syncService.importarDesdeAPI();

    if (mascotasImportadas.length > 0) {
      // Agregar mascotas importadas a la lista existente
      this.mascotas = [...mascotasImportadas, ...this.mascotas];
      this.saveStore();
      this.showToast(`✅ ${mascotasImportadas.length} mascotas importadas desde API`, 'success');
      this.scrollToTop();
    } else {
      this.showToast('❌ No se pudieron importar mascotas', 'danger');
    }
  }

  /**
   * Obtiene el texto del estado de sincronización
   */
  getSyncStatusText(): string {
    const state = this.syncState;
    if (state.status === 'syncing') {
      return state.message;
    }
    if (state.lastSyncedAt) {
      const date = new Date(state.lastSyncedAt);
      return `Última sincronización: ${date.toLocaleString('es-CL')}`;
    }
    return 'No sincronizado';
  }

  /**
   * Obtiene el color del badge de sincronización
   */
  getSyncStatusColor(mascota: Mascota): string {
    if (!mascota.syncStatus) return 'medium';
    switch (mascota.syncStatus) {
      case 'synced': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'danger';
      default: return 'medium';
    }
  }

  /**
   * Obtiene el icono del badge de sincronización
   */
  getSyncStatusIcon(mascota: Mascota): string {
    if (!mascota.syncStatus) return 'cloud-upload';
    switch (mascota.syncStatus) {
      case 'synced': return 'cloud-done';
      case 'pending': return 'cloud-upload';
      case 'error': return 'close-circle';
      default: return 'cloud-upload';
    }
  }
}
