// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Propiedad interna que almacena el estado
  private _isAuthenticated = new BehaviorSubject<boolean>(false); 
  
  // Propiedad pública que es un Observable (para suscribirse en el HTML o TS)
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor() {
    this.checkToken(); 
  }

  // 🛡️ MÉTODO SÍNCRONO REQUERIDO POR EL GUARD (CORRECCIÓN)
  /**
   * Devuelve el estado actual de autenticación de forma síncrona.
   * Usado principalmente por los Guards y otras funciones de chequeo inmediato.
   */
  public isAuthenticated(): boolean {
      return this._isAuthenticated.value; // Devuelve el valor actual del BehaviorSubject
  }
  
  private checkToken() {
    const token = localStorage.getItem('auth_token');
    this._isAuthenticated.next(!!token); 
  }

  async login(email: string, password: string): Promise<boolean> {
    // Simulación del proceso de Login
    if (email === 'Sincere@april.biz' && password === 'password') {
        localStorage.setItem('auth_token', 'simulated_jwt_token');
        this._isAuthenticated.next(true); 
        return true;
    } else {
        this._isAuthenticated.next(false);
        return false;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token'); 
    this._isAuthenticated.next(false);     
  }
}