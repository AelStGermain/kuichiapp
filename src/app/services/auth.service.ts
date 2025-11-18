import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

// La interfaz de usuario ahora puede incluir un ID de la API
export interface User {
  id?: number; // ID de la API (opcional)
  email: string;
  name?: string;
  loggedAt: number;
}

// Interfaz para la respuesta de la API de JSONPlaceholder
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private key = 'kuichi_user_v1';
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor() {
    const user = this.getStoredUser();
    if (user) {
      this.userSubject.next(user);
    }
  }

  /**
   * Intenta iniciar sesión llamando a una API externa.
   * @param email El email del usuario.
   * @param password La contraseña (ignorada por la API de prueba, pero necesaria para la firma).
   * @returns true si el inicio de sesión fue exitoso, false en caso contrario.
   */
  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) return false;

    // La API de prueba no valida contraseña, solo busca por email.
    // En una API real, enviarías email y password en un POST.
    const url = `${environment.apiUrl}/users?email=${email}`;

    try {
      // Hacemos la petición a la API y esperamos el primer valor
      const users = await firstValueFrom(this.http.get<ApiUser[]>(url));
      
      // Verificamos si la API devolvió algún usuario con ese email
      const apiUser = users?.[0];

      if (apiUser) {
        // Creamos nuestro objeto de usuario y lo guardamos
        const user: User = { 
          id: apiUser.id,
          email: apiUser.email, 
          name: apiUser.name,
          loggedAt: Date.now() 
        };
        
        localStorage.setItem(this.key, JSON.stringify(user));
        this.userSubject.next(user);
        return true;
      }
      
      // Si no se encontró el usuario
      return false;

    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.key);
    this.userSubject.next(null);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    const isValid = (Date.now() - user.loggedAt) < maxAge;
    
    if (!isValid) {
      this.logout();
      return false;
    }
    
    return true;
  }

  renewSession(): void {
    const user = this.getUser();
    if (user) {
      user.loggedAt = Date.now();
      localStorage.setItem(this.key, JSON.stringify(user));
      this.userSubject.next(user);
    }
  }
}
