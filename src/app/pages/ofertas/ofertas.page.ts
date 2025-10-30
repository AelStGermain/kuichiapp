import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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

  ofertas: { titulo: string; descripcion: string }[] = [
    { titulo: 'Descuento en vacunas', descripcion: '20% en PetSalud hasta el viernes' },
    { titulo: 'Control dental gratis', descripcion: 'Clínica VetSmile ofrece revisión sin costo este mes' }
  ];

  agregarOferta() {
    if (this.nuevaOferta.titulo && this.nuevaOferta.descripcion) {
      this.ofertas.unshift({ ...this.nuevaOferta });
      this.nuevaOferta = { titulo: '', descripcion: '' };
    }
  }

  eliminarOferta(oferta: { titulo: string; descripcion: string }) {
    this.ofertas = this.ofertas.filter(o => o !== oferta);
  }
}
