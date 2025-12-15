import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Mascota {
    id?: string;
    nombre: string;
    especie: string;
    edad?: string;
    notas?: string;
    createdAt: number;
    foto?: string;
    syncStatus?: 'pending' | 'synced' | 'error';
    lastSyncedAt?: number;
    remoteId?: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);

    // Configuración de URLs
    private readonly backendUrl = environment.apiUrl; // Spring Boot backend
    private readonly externalApiUrl = 'https://jsonplaceholder.typicode.com'; // API externa para demos

    // ========== CRUD DE MASCOTAS (BACKEND SPRING BOOT) ==========

    /**
     * Obtiene todas las mascotas del backend
     */
    getMascotas(): Observable<Mascota[]> {
        return this.http.get<Mascota[]>(`${this.backendUrl}/mascotas`, {
            headers: this.getHeaders()
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    /**
     * Crea una nueva mascota en el backend
     */
    createMascota(mascota: Mascota): Observable<Mascota> {
        return this.http.post<Mascota>(`${this.backendUrl}/mascotas`, mascota, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Actualiza una mascota existente
     */
    updateMascota(id: string, mascota: Partial<Mascota>): Observable<Mascota> {
        return this.http.put<Mascota>(`${this.backendUrl}/mascotas/${id}`, mascota, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Elimina una mascota
     */
    deleteMascota(id: string): Observable<void> {
        return this.http.delete<void>(`${this.backendUrl}/mascotas/${id}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Sincroniza múltiples mascotas en batch
     */
    syncMascotas(mascotas: Mascota[]): Observable<any> {
        return this.http.post(`${this.backendUrl}/mascotas/sync`, { mascotas }, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    // ========== API EXTERNA (JSONPLACEHOLDER) ==========

    /**
     * Obtiene datos de API externa para demostración
     */
    getExternalData<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.externalApiUrl}${endpoint}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Realiza POST a API externa
     */
    postExternalData<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.externalApiUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    // ========== MÉTODOS PRIVADOS ==========

    /**
     * Obtiene headers por defecto
     */
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    /**
     * Maneja errores de HTTP con información detallada
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código ${error.status}: ${error.message}`;

            // Mensajes específicos por código de estado
            switch (error.status) {
                case 0:
                    errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo.';
                    break;
                case 400:
                    errorMessage = 'Solicitud inválida (400 Bad Request)';
                    break;
                case 401:
                    errorMessage = 'No autorizado (401 Unauthorized)';
                    break;
                case 403:
                    errorMessage = 'Acceso prohibido (403 Forbidden)';
                    break;
                case 404:
                    errorMessage = 'Recurso no encontrado (404 Not Found)';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor (500 Internal Server Error)';
                    break;
            }
        }

        console.error('❌ Error en petición HTTP:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}
