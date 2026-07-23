import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonBackButton,
  IonSpinner, IonIcon, IonLabel, IonChip, IonButton, IonFab, IonFabButton,
  IonModal, IonInput, IonSelect, IonSelectOption, IonItem,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { Veterinaria } from '../../models/veterinaria.model';
import { VeterinariaService } from '../../services/veterinaria.service';
import { AuthService } from '../../services/auth.service';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { addIcons } from 'ionicons';
import { add, create, trash, map, call, locationOutline, timeOutline, close, checkmark, medicalOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.page.html',
  styleUrls: ['./veterinarias.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon, IonLabel, IonChip, IonButton, IonFab,
    IonFabButton, IonModal, IonInput, IonSelect, IonSelectOption, IonItem,
    SanitizePipe
  ]
})
export class VeterinariasPage implements OnInit {

  public veterinarias: Veterinaria[] = [
    {
      id: 'demo-providencia',
      nombre: 'Clínica Veterinaria Providencia',
      direccion: 'Av. Providencia 1844, Santiago',
      telefono: '+56 2 2235 4120',
      horario: 'Lun a sáb · 09:00–20:00',
      especialidades: ['perros', 'gatos'],
      latitud: -33.4265,
      longitud: -70.6146
    },
    {
      id: 'demo-nunoa',
      nombre: 'Centro Veterinario Ñuñoa',
      direccion: 'Av. Irarrázaval 3120, Ñuñoa',
      telefono: '+56 2 2274 8890',
      horario: 'Todos los días · 08:00–22:00',
      especialidades: ['perros', 'gatos', 'exoticos'],
      latitud: -33.4534,
      longitud: -70.5953
    }
  ];
  public isModalOpen = false;
  public isEditing = false;
  public currentVeterinaria: Partial<Veterinaria> = {};

  // Observable para verificar si el usuario es admin
  public isAdmin$: Observable<boolean>;

  // Coordenadas de Santiago para el mapa
  public santiagoLat = -33.4489;
  public santiagoLng = -70.6693;

  constructor(
    private veterinariaService: VeterinariaService,
    private toastController: ToastController,
    private alertController: AlertController,
    private auth: AuthService
  ) {
    addIcons({ add, create, trash, map, call, locationOutline, timeOutline, close, checkmark, medicalOutline });
    this.isAdmin$ = this.auth.isAdmin();
  }

  ngOnInit() {
    this.veterinariaService.getVeterinarias().subscribe({
      next: data => {
        if (data.length > 0) this.veterinarias = data;
      },
      error: error => console.warn('Se muestran veterinarias de demostración.', error)
    });
  }

  /**
   * Abre el modal para agregar una nueva veterinaria
   */
  openAddModal() {
    this.isEditing = false;
    this.currentVeterinaria = {
      nombre: '',
      direccion: '',
      telefono: '',
      horario: '',
      especialidades: [],
      latitud: this.santiagoLat,
      longitud: this.santiagoLng
    };
    this.isModalOpen = true;
  }

  /**
   * Abre el modal para editar una veterinaria existente
   */
  openEditModal(veterinaria: Veterinaria) {
    this.isEditing = true;
    this.currentVeterinaria = { ...veterinaria };
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    this.isModalOpen = false;
    this.currentVeterinaria = {};
    this.isEditing = false;
  }

  /**
   * Guarda la veterinaria (agregar o editar)
   */
  async saveVeterinaria() {
    // Validación
    if (!this.currentVeterinaria.nombre || !this.currentVeterinaria.direccion) {
      await this.showToast('Por favor completa los campos obligatorios', 'warning');
      return;
    }

    try {
      if (this.isEditing && this.currentVeterinaria.id) {
        // Actualizar
        await this.veterinariaService.updateVeterinaria(this.currentVeterinaria.id, this.currentVeterinaria);
        await this.showToast('Veterinaria actualizada correctamente', 'success');
      } else {
        // Agregar nueva
        // Firestore genera el ID, así que no necesitamos pasarlo si es undefined
        const { id, ...newVet } = this.currentVeterinaria;
        // Cast necesario porque el modelo tiene id opcional pero el servicio espera el objeto completo (menos id que es opcional)
        await this.veterinariaService.addVeterinaria(newVet as Veterinaria);
        await this.showToast('Veterinaria agregada correctamente', 'success');
      }

      // Cerrar modal y resetear
      this.closeModal();
    } catch (error) {
      console.error('Error al guardar:', error);
      await this.showToast('Error al guardar la veterinaria', 'danger');
    }
  }

  /**
   * Elimina una veterinaria con confirmación
   */
  async deleteVeterinaria(veterinaria: Veterinaria) {
    if (!veterinaria.id) return;

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${veterinaria.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              if (veterinaria.id) {
                await this.veterinariaService.deleteVeterinaria(veterinaria.id);
                this.showToast('Veterinaria eliminada', 'danger');
              }
            } catch (error) {
              console.error('Error al eliminar:', error);
              this.showToast('Error al eliminar la veterinaria', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Abre la ubicación en Google Maps
   */
  openInMaps(veterinaria: Veterinaria) {
    const url = `https://www.google.com/maps?q=${veterinaria.latitud},${veterinaria.longitud}`;
    window.open(url, '_blank');
  }

  /**
   * Realiza una llamada telefónica
   */
  callVeterinaria(telefono: string) {
    if (telefono) {
      window.location.href = `tel:${telefono}`;
    }
  }

  /**
   * Muestra un toast
   */
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  /**
   * Maneja el cambio de especialidades
   */
  onEspecialidadesChange(event: any) {
    this.currentVeterinaria.especialidades = event.detail.value;
  }
}
