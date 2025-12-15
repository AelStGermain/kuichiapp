// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private userService = inject(UserService);

  // Observable que emite el estado de autenticación de Firebase
  public readonly authState$: Observable<FirebaseUser | null> = authState(this.auth);

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
   * Obtiene el usuario actual de Firebase (si existe)
   */
  public getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Obtiene el rol del usuario actual
   */
  public getCurrentUserRole(): Observable<UserRole | null> {
    return this.authState$.pipe(
      switchMap(user => {
        if (!user) return new Observable<UserRole | null>(observer => {
          observer.next(null);
          observer.complete();
        });
        return this.userService.getUserRole(user.uid);
      })
    );
  }

  /**
   * Verifica si el usuario actual es admin
   */
  public isAdmin(): Observable<boolean> {
    return this.getCurrentUserRole().pipe(
      map(role => role === 'admin')
    );
  }

  /**
   * Obtiene el ID del usuario actual o null si no hay sesión
   */
  public getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  /**
   * Inicia sesión con correo y contraseña
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCred = await signInWithEmailAndPassword(this.auth, email, password);
      await this.ensureUserExists(userCred.user);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(email: string, password: string, displayName?: string): Promise<boolean> {
    try {
      const userCred = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.createUserDocument(userCred.user, displayName);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  }

  /**
   * Inicia sesión con Google
   */
  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(this.auth, provider);
      await this.ensureUserExists(userCred.user);
      return true;
    } catch (error) {
      console.error('Error en login con Google:', error);
      return false;
    }
  }

  /**
   * Asegura que el usuario existe en Firestore, si no, lo crea con rol 'user'
   */
  private async ensureUserExists(firebaseUser: FirebaseUser): Promise<void> {
    const exists = await this.userService.userExists(firebaseUser.uid);
    if (!exists) {
      await this.createUserDocument(firebaseUser);
    }
  }

  /**
   * Crea el documento del usuario en Firestore
   */
  private async createUserDocument(firebaseUser: FirebaseUser, displayName?: string): Promise<void> {
    // Usuarios específicos serán admin
    const adminEmails = ['admin@kuichi.com'];
    const role: UserRole = adminEmails.includes(firebaseUser.email || '') ? 'admin' : 'user';

    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      createdAt: Date.now()
    };

    // Solo agregar displayName si existe
    const name = displayName || firebaseUser.displayName;
    if (name) {
      user.displayName = name;
    }

    // Solo agregar photoURL si existe
    if (firebaseUser.photoURL) {
      user.photoURL = firebaseUser.photoURL;
    }

    await this.userService.createUser(user);
    console.log(`✅ Usuario creado con rol: ${role}`);
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