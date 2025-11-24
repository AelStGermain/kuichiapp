import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonBackButton,
  IonSpinner, IonIcon, IonLabel, IonChip, IonButton, IonFab, IonFabButton,
  IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption, IonItem,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { Veterinaria } from '../../models/veterinaria.model';
import { VeterinariaService } from '../../services/veterinaria.service';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { addIcons } from 'ionicons';
import { add, create, trash, map, call, locationOutline, timeOutline, close, checkmark, medicalOutline } from 'ionicons/icons';

@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.page.html',
  styleUrls: ['./veterinarias.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons,
    IonBackButton, IonSpinner, IonIcon, IonLabel, IonChip, IonButton, IonFab,
    IonFabButton, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption, IonItem,
    SanitizePipe
  ]
})
export class VeterinariasPage implements OnInit {

  public veterinarias: Veterinaria[] = [];
  public isModalOpen = false;
  public isEditing = false;
  public currentVeterinaria: Partial<Veterinaria> = {};

  // Coordenadas de Santiago para el mapa
  public santiagoLat = -33.4489;
  public santiagoLng = -70.6693;

  constructor(
    private veterinariaService: VeterinariaService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ add, create, trash, map, call, locationOutline, timeOutline, close, checkmark, medicalOutline });
  }

  ngOnInit() {
    this.veterinariaService.getVeterinarias().subscribe(data => {
      this.veterinarias = data;
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

    if (this.isEditing && this.currentVeterinaria.id) {
      // Actualizar
      this.veterinariaService.updateVeterinaria(this.currentVeterinaria.id, this.currentVeterinaria);
      await this.showToast('Veterinaria actualizada correctamente', 'success');
    } else {
      // Agregar nueva
      const { id, ...newVet } = this.currentVeterinaria;
      this.veterinariaService.addVeterinaria(newVet as Omit<Veterinaria, 'id'>);
      await this.showToast('Veterinaria agregada correctamente', 'success');
    }

    // Cerrar modal y resetear
    this.closeModal();
  }

  /**
   * Elimina una veterinaria con confirmación
   */
  async deleteVeterinaria(veterinaria: Veterinaria) {
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
          handler: () => {
            this.veterinariaService.deleteVeterinaria(veterinaria.id);
            this.showToast('Veterinaria eliminada', 'danger');
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

