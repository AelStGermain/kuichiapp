// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    tap(loggedIn => {
      if (!loggedIn) {
        // Si no está logueado, redirige al login
        router.navigate(['/login'], { queryParams: { redirect: state.url } });
      }
    })
  );
};
