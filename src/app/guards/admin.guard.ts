import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.getCurrentUserRole().pipe(
        take(1),
        map(role => role === 'admin'),
        tap(isAdmin => {
            if (!isAdmin) {
                console.warn('⛔ Acceso denegado: se requiere rol de administrador');
                router.navigate(['/']);
            }
        })
    );
};
