import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Veterinaria } from '../models/veterinaria.model';

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {
  private firestore: Firestore = inject(Firestore);
  private readonly collectionName = 'veterinarias';

  constructor() { }

  /**
   * Obtiene todas las veterinarias desde Firestore
   */
  getVeterinarias(): Observable<Veterinaria[]> {
    const veterinariasRef = collection(this.firestore, this.collectionName);
    return collectionData(veterinariasRef, { idField: 'id' }) as Observable<Veterinaria[]>;
  }

  /**
   * Obtiene una veterinaria por ID
   */
  getVeterinariaById(id: string): Observable<Veterinaria | undefined> {
    const veterinariaDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(veterinariaDocRef, { idField: 'id' }) as Observable<Veterinaria>;
  }

  /**
   * Agrega una nueva veterinaria
   */
  addVeterinaria(veterinaria: Veterinaria): Promise<void> {
    const veterinariasRef = collection(this.firestore, this.collectionName);
    return addDoc(veterinariasRef, veterinaria) as unknown as Promise<void>;
  }

  /**
   * Actualiza una veterinaria existente
   */
  updateVeterinaria(id: string, veterinaria: Partial<Veterinaria>): Promise<void> {
    const veterinariaDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(veterinariaDocRef, veterinaria);
  }

  /**
   * Elimina una veterinaria
   */
  deleteVeterinaria(id: string): Promise<void> {
    const veterinariaDocRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(veterinariaDocRef);
  }
}
