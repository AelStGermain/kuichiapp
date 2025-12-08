// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Observable que emite el estado de autenticación de Firebase
  public readonly authState$: Observable<User | null> = authState(this.auth);

  // Mantenemos el BehaviorSubject para compatibilidad con el código existente que espera un booleano síncrono (aunque es mejor usar el observable)
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private authSubscription: Subscription;

  constructor() {
    // Suscribirse al estado de autenticación de Firebase para actualizar nuestro BehaviorSubject local
    this.authSubscription = this.authState$.subscribe(user => {
      this._isAuthenticated.next(!!user);
    });
  }

  // 🛡️ MÉTODO SÍNCRONO REQUERIDO POR EL GUARD
  /**
   * Devuelve el estado actual de autenticación de forma síncrona.
   * Nota: Esto puede ser false inicialmente hasta que Firebase inicialice.
   * Se recomienda migrar los Guards a usar authState$ directamente.
   */
  public isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  /**
   * Inicia sesión con correo y contraseña
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  /**
   * Inicia sesión con Google
   */
  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      return true;
    } catch (error) {
      console.error('Error en login con Google:', error);
      return false;
    }
  }

  /**
   * Cierra la sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // El subscription actualizará _isAuthenticated automáticamente
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }
}