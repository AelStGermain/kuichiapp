import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Veterinaria } from '../models/veterinaria.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {

  private veterinarias: Veterinaria[] = [
    {
      id: 1,
      nombre: 'Clínica VetSalud',
      direccion: 'Av. Siempre Viva 123, Santiago',
      telefono: '+56 2 1234 5678',
      horario: 'Lunes a Viernes 9:00 - 18:00',
      especialidades: ['perros', 'gatos'],
      latitud: -33.45694,
      longitud: -70.64827
    },
    {
      id: 2,
      nombre: 'Centro Animalia',
      direccion: 'Calle Falsa 456, Valparaíso',
      telefono: '+56 32 9876 5432',
      horario: '24/7 Urgencias',
      especialidades: ['perros', 'gatos', 'exoticos'],
      latitud: -33.0458,
      longitud: -71.6197
    },
    {
      id: 3,
      nombre: 'ExoticPets Center',
      direccion: 'Paseo del Parque 789, Viña del Mar',
      telefono: '+56 32 1122 3344',
      horario: 'Lunes a Sábado 10:00 - 20:00',
      especialidades: ['exoticos'],
      latitud: -33.0246,
      longitud: -71.5518
    },
    {
      id: 4,
      nombre: 'Vet Amigo Fiel',
      direccion: 'Av. Providencia 910, Santiago',
      telefono: '+56 2 5555 4444',
      horario: 'Lunes a Viernes 8:00 - 19:00',
      especialidades: ['perros'],
      latitud: -33.4313,
      longitud: -70.6093
    }
  ];

  constructor() { }

  getVeterinarias(): Observable<Veterinaria[]> {
    return of(this.veterinarias);
  }
}
