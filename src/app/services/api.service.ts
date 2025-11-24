import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    // Configuración
    private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

    /**
     * Realiza una petición GET
     */
    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Realiza una petición POST
     */
    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

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
     * Maneja errores de HTTP
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Error desconocido';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Código de error: ${error.status}`;
        }

        console.error('Error en petición HTTP:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
