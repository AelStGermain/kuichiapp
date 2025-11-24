import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mascota } from '../pages/mascotas/mascotas.page';

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

    private _syncState = new BehaviorSubject<SyncState>({
        status: 'idle',
        lastSyncedAt: null,
        message: ''
    });

    public syncState$ = this._syncState.asObservable();

    // API base URL - JSONPlaceholder para demostración
    private apiUrl = 'https://jsonplaceholder.typicode.com';

    constructor() {
        this.loadLastSyncTime();
    }

    /**
     * Obtiene el estado actual de sincronización
     */
    getCurrentState(): SyncState {
        return this._syncState.value;
    }

    /**
     * Sincroniza mascotas locales con el servidor
     * En producción, esto enviaría los datos a tu backend
     */
    async sincronizarMascotas(mascotas: Mascota[]): Promise<boolean> {
        this.updateState('syncing', 'Sincronizando con servidor...');

        try {
            // Simular envío al servidor
            // En producción: await this.http.post(`${this.apiUrl}/mascotas`, mascotas).toPromise();

            // Por ahora, simulamos con un delay
            await this.delay(1500);

            // Marcar todas como sincronizadas
            const mascotasSincronizadas = mascotas.map(m => ({
                ...m,
                syncStatus: 'synced' as const,
                lastSyncedAt: Date.now()
            }));

            // Guardar en localStorage
            localStorage.setItem('kuichi_mascotas_v1', JSON.stringify(mascotasSincronizadas));

            const timestamp = Date.now();
            this.saveLastSyncTime(timestamp);
            this.updateState('success', `Sincronizado exitosamente (${mascotas.length} mascotas)`, timestamp);

            return true;
        } catch (error) {
            console.error('Error en sincronización:', error);
            this.updateState('error', 'Error al sincronizar con el servidor');
            return false;
        }
    }

    /**
     * Importa tareas desde JSONPlaceholder API y las convierte en mascotas
     */
    async importarDesdeAPI(): Promise<Mascota[]> {
        this.updateState('syncing', 'Importando desde API externa...');

        try {
            // Obtener tareas desde JSONPlaceholder
            const todos: any[] = await this.http.get<any[]>(`${this.apiUrl}/todos?_limit=5`).toPromise() || [];

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
            this.updateState('success', `${mascotasImportadas.length} mascotas importadas desde API`, timestamp);

            return mascotasImportadas;
        } catch (error) {
            console.error('Error al importar desde API:', error);
            this.updateState('error', 'Error al importar desde API externa');
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
        localStorage.setItem('kuichi_last_sync', timestamp.toString());
    }

    private loadLastSyncTime(): void {
        const stored = localStorage.getItem('kuichi_last_sync');
        if (stored) {
            this._syncState.next({
                ...this._syncState.value,
                lastSyncedAt: parseInt(stored, 10)
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
