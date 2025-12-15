import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private firestore = inject(Firestore);

    /**
     * Crea un nuevo usuario en Firestore
     */
    async createUser(user: User): Promise<void> {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userRef, user);
    }

    /**
     * Obtiene un usuario por UID
     */
    getUser(uid: string): Observable<User | null> {
        const userRef = doc(this.firestore, `users/${uid}`);
        return docData(userRef, { idField: 'uid' }).pipe(
            map(data => data as User),
            catchError(error => {
                console.error('Error getting user:', error);
                return of(null);
            })
        );
    }

    /**
     * Actualiza el rol de un usuario (solo admin)
     */
    async updateUserRole(uid: string, role: UserRole): Promise<void> {
        const userRef = doc(this.firestore, `users/${uid}`);
        await updateDoc(userRef, { role });
    }

    /**
     * Verifica si un usuario existe en Firestore
     */
    async userExists(uid: string): Promise<boolean> {
        const userRef = doc(this.firestore, `users/${uid}`);
        const snapshot = await getDoc(userRef);
        return snapshot.exists();
    }

    /**
     * Obtiene el rol del usuario actual
     */
    getUserRole(uid: string): Observable<UserRole | null> {
        return this.getUser(uid).pipe(
            map(user => user?.role || null)
        );
    }
}
