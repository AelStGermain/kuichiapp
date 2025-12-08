export interface Veterinaria {
  id?: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  especialidades: ('perros' | 'gatos' | 'exoticos')[];
  latitud: number;
  longitud: number;
}
