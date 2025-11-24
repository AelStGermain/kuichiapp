import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Veterinaria } from '../models/veterinaria.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {

  private readonly STORAGE_KEY = 'kuichi_veterinarias_v1';
  private veterinariasSubject = new BehaviorSubject<Veterinaria[]>([]);
  public veterinarias$ = this.veterinariasSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Carga las veterinarias desde localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const veterinarias = JSON.parse(stored);
        this.veterinariasSubject.next(veterinarias);
      } else {
        // Si no hay datos, inicializar con datos de ejemplo
        this.initializeDefaultData();
      }
    } catch (error) {
      console.error('Error al cargar veterinarias:', error);
      this.initializeDefaultData();
    }
  }

  /**
   * Guarda las veterinarias en localStorage
   */
  private saveToStorage(veterinarias: Veterinaria[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(veterinarias));
      this.veterinariasSubject.next(veterinarias);
    } catch (error) {
      console.error('Error al guardar veterinarias:', error);
    }
  }

  /**
   * Inicializa datos de ejemplo
   */
  private initializeDefaultData(): void {
    const defaultVeterinarias: Veterinaria[] = [
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
        direccion: 'Calle Falsa 456, Providencia',
        telefono: '+56 32 9876 5432',
        horario: '24/7 Urgencias',
        especialidades: ['perros', 'gatos', 'exoticos'],
        latitud: -33.4313,
        longitud: -70.6093
      },
      {
        id: 3,
        nombre: 'ExoticPets Center',
        direccion: 'Paseo del Parque 789, Las Condes',
        telefono: '+56 32 1122 3344',
        horario: 'Lunes a Sábado 10:00 - 20:00',
        especialidades: ['exoticos'],
        latitud: -33.4172,
        longitud: -70.5476
      },
      {
        id: 4,
        nombre: 'Vet Amigo Fiel',
        direccion: 'Av. Providencia 910, Santiago',
        telefono: '+56 2 5555 4444',
        horario: 'Lunes a Viernes 8:00 - 19:00',
        especialidades: ['perros'],
        latitud: -33.4372,
        longitud: -70.6344
      }
    ];
    this.saveToStorage(defaultVeterinarias);
  }

  /**
   * Obtiene todas las veterinarias
   */
  getVeterinarias(): Observable<Veterinaria[]> {
    return this.veterinarias$;
  }

  /**
   * Obtiene una veterinaria por ID
   */
  getVeterinariaById(id: number): Veterinaria | undefined {
    return this.veterinariasSubject.value.find(v => v.id === id);
  }

  /**
   * Agrega una nueva veterinaria
   */
  addVeterinaria(veterinaria: Omit<Veterinaria, 'id'>): void {
    const veterinarias = this.veterinariasSubject.value;
    const newId = veterinarias.length > 0
      ? Math.max(...veterinarias.map(v => v.id)) + 1
      : 1;

    const newVeterinaria: Veterinaria = {
      ...veterinaria,
      id: newId
    };

    this.saveToStorage([...veterinarias, newVeterinaria]);
  }

  /**
   * Actualiza una veterinaria existente
   */
  updateVeterinaria(id: number, veterinaria: Partial<Veterinaria>): void {
    const veterinarias = this.veterinariasSubject.value;
    const index = veterinarias.findIndex(v => v.id === id);

    if (index !== -1) {
      veterinarias[index] = { ...veterinarias[index], ...veterinaria };
      this.saveToStorage([...veterinarias]);
    }
  }

  /**
   * Elimina una veterinaria
   */
  deleteVeterinaria(id: number): void {
    const veterinarias = this.veterinariasSubject.value.filter(v => v.id !== id);
    this.saveToStorage(veterinarias);
  }
}
