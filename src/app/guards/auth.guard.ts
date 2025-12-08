// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1), // Toma solo el primer valor emitido (el estado actual) y completa
    map(user => !!user), // Convierte el usuario a booleano (true si existe, false si no)
    tap(loggedIn => {
      if (!loggedIn) {
        // Si no está logueado, redirige al login
        router.navigate(['/login'], { queryParams: { redirect: state.url } });
      }
    })
  );
};