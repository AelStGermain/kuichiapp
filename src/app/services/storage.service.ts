import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    // En una app real, esta clave debería venir de environment o ser derivada del usuario
    private readonly SECRET_KEY = 'kuichi-super-secret-key-2025';

    constructor() { }

    /**
     * Guarda un valor encriptado en localStorage
     */
    set(key: string, value: any): void {
        try {
            const jsonValue = JSON.stringify(value);
            const encrypted = CryptoJS.AES.encrypt(jsonValue, this.SECRET_KEY).toString();
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Error al guardar datos encriptados:', error);
        }
    }

    /**
     * Obtiene y desencripta un valor de localStorage
     */
    get<T>(key: string): T | null {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) return null;

            return JSON.parse(decrypted) as T;
        } catch (error) {
            console.error('Error al leer datos encriptados:', error);
            return null;
        }
    }

    /**
     * Elimina un valor de localStorage
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Limpia todo el localStorage (usar con precaución)
     */
    clear(): void {
        localStorage.clear();
    }
}
