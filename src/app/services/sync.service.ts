import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Mascota } from '../pages/mascotas/mascotas.page';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncState {
    status: SyncStatus;
    lastSyncedAt: number | null;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    private auth = inject(AuthService);
    private apiService = inject(ApiService);

    private _syncState = new BehaviorSubject<SyncState>({
        status: 'idle',
        lastSyncedAt: null,
        message: ''
    });

    public syncState$ = this._syncState.asObservable();

    // Configuración de backend
    private useRealBackend = true; // Cambiar a false para usar simulación

    constructor() {
        // Suscribirse a cambios de auth para recargar timestamp
        this.auth.authState$.subscribe(user => {
            this.loadLastSyncTime();
        });
    }

    /**
     * Obtiene el estado actual de sincronización
     */
    getCurrentState(): SyncState {
        return this._syncState.value;
    }

    /**
     * Sincroniza mascotas locales con el servidor Spring Boot
     */
    async sincronizarMascotas(mascotas: Mascota[]): Promise<boolean> {
        this.updateState('syncing', 'Conectando con servidor...');

        try {
            if (this.useRealBackend) {
                // USAR API REAL - Spring Boot backend
                console.log('🚀 Sincronizando con backend Spring Boot...');
                const response = await firstValueFrom(
                    this.apiService.syncMascotas(mascotas)
                );

                console.log('✅ Respuesta del backend:', response);
            } else {
                // SIMULACIÓN (fallback si backend no está disponible)
                console.log('⚠️ Usando modo simulación (backend desactivado)');
                await this.delay(1500);
            }

            // Marcar todas como sincronizadas
            const mascotasSincronizadas = mascotas.map(m => ({
                ...m,
                syncStatus: 'synced' as const,
                lastSyncedAt: Date.now()
            }));

            // Guardar en localStorage usando StorageService y clave de usuario
            const uid = this.auth.getCurrentUserId();
            if (uid) {
                const key = `kuichi_mascotas_${uid}`;
                this.storage.set(key, mascotasSincronizadas);
            }

            const timestamp = Date.now();
            this.saveLastSyncTime(timestamp);
            this.updateState('success', `✅ Sincronizado exitosamente (${mascotas.length} mascotas)`, timestamp);

            return true;
        } catch (error: any) {
            console.error('❌ Error en sincronización:', error);

            // Si falla el backend real, intentar con simulación
            if (this.useRealBackend && error.message?.includes('conectar al servidor')) {
                console.warn('⚠️ Backend no disponible, usando modo offline');
                this.updateState('error', '❌ Backend no disponible. Datos guardados localmente.');
            } else {
                this.updateState('error', '❌ Error al sincronizar con el servidor');
            }
            return false;
        }
    }

    /**
     * Importa tareas desde JSONPlaceholder API y las convierte en mascotas
     */
    async importarDesdeAPI(): Promise<Mascota[]> {
        this.updateState('syncing', 'Importando desde API externa...');

        try {
            // Obtener tareas desde JSONPlaceholder usando ApiService
            const todos: any[] = await firstValueFrom(
                this.apiService.getExternalData<any[]>('/todos?_limit=5')
            );

            // Convertir tareas a mascotas
            const mascotasImportadas: Mascota[] = todos.map((todo, index) => ({
                id: `api-${todo.id}-${Date.now()}`,
                nombre: this.generarNombreMascota(index),
                especie: this.generarEspecie(index),
                edad: this.generarEdad(),
                notas: `Importado desde API: ${todo.title}`,
                createdAt: Date.now() - (index * 100000),
                syncStatus: 'synced' as const,
                lastSyncedAt: Date.now(),
                remoteId: todo.id.toString()
            }));

            const timestamp = Date.now();
            this.saveLastSyncTime(timestamp);
            this.updateState('success', `✅ ${mascotasImportadas.length} mascotas importadas desde API`, timestamp);

            return mascotasImportadas;
        } catch (error) {
            console.error('❌ Error al importar desde API:', error);
            this.updateState('error', '❌ Error al importar desde API externa');
            return [];
        }
    }

    /**
     * Exporta mascotas al servidor remoto
     */
    async exportarMascotas(mascotas: Mascota[]): Promise<boolean> {
        this.updateState('syncing', 'Exportando mascotas...');

        try {
            // En producción, enviarías a tu backend
            // const response = await this.http.post(`${this.apiUrl}/mascotas/export`, mascotas).toPromise();

            // Simulación
            await this.delay(1000);

            const timestamp = Date.now();
            this.saveLastSyncTime(timestamp);
            this.updateState('success', `${mascotas.length} mascotas exportadas`, timestamp);

            return true;
        } catch (error) {
            console.error('Error al exportar:', error);
            this.updateState('error', 'Error al exportar mascotas');
            return false;
        }
    }

    /**
     * Resetea el estado de sincronización
     */
    resetState(): void {
        this.updateState('idle', '');
    }

    // ========== MÉTODOS PRIVADOS ==========

    private updateState(status: SyncStatus, message: string, lastSyncedAt?: number): void {
        this._syncState.next({
            status,
            message,
            lastSyncedAt: lastSyncedAt ?? this._syncState.value.lastSyncedAt
        });
    }

    private saveLastSyncTime(timestamp: number): void {
        const uid = this.auth.getCurrentUserId();
        if (!uid) return;
        this.storage.set(`kuichi_last_sync_${uid}`, timestamp);
    }

    private loadLastSyncTime(): void {
        const uid = this.auth.getCurrentUserId();
        if (!uid) {
            this._syncState.next({ ...this._syncState.value, lastSyncedAt: null });
            return;
        }

        const stored = this.storage.get<number>(`kuichi_last_sync_${uid}`);
        if (stored) {
            this._syncState.next({
                ...this._syncState.value,
                lastSyncedAt: stored
            });
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generadores de datos para importación
    private generarNombreMascota(index: number): string {
        const nombres = ['Luna', 'Max', 'Bella', 'Rocky', 'Coco', 'Milo', 'Nala', 'Simba'];
        return nombres[index % nombres.length];
    }

    private generarEspecie(index: number): string {
        const especies = ['Perro', 'Gato', 'Conejo', 'Hamster'];
        return especies[index % especies.length];
    }

    private generarEdad(): string {
        const edades = ['1 año', '2 años', '3 años', '6 meses', '1.5 años'];
        return edades[Math.floor(Math.random() * edades.length)];
    }
}
