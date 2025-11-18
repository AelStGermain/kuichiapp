export interface Veterinaria {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  especialidades: ('perros' | 'gatos' | 'exoticos')[];
  latitud: number;
  longitud: number;
}
