export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  edad?: string;
  notas?: string;
  createdAt: number;
  //  mascotas exóticas
  esExotica?: boolean;
  tipoExotica?: 'reptil' | 'ave' | 'mamifero_exotico' | 'anfibio' | 'pez' | 'otro';
  requierePermiso?: boolean;
  cuidadosEspeciales?: string;
  veterinariaEspecializada?: string;
  // ambiente  para exóticas
  temperatura?: {
    min: number;
    max: number;
  };
  humedad?: number;
  // Información médica
  vacunas?: string[];
  ultimaVisitaVet?: string;
  proximaCita?: string;
  // Foto
  foto?: string;
}

export const ESPECIES_COMUNES = [
  'Perro', 'Gato', 'Conejo', 'Hámster', 'Cobaya'
];

export const ESPECIES_EXOTICAS = [
  'Iguana', 'Gecko', 'Serpiente', 'Tortuga',
  'Loro', 'Canario', 'Cacatúa', 'Periquito',
  'Hurón', 'Chinchilla', 'Erizo',
  'Axolotl', 'Rana', 'Salamandra',
  'Pez Betta', 'Goldfish', 'Pez Ángel'
];