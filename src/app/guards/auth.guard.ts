// src/app/guards/auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // Esta línea ahora funciona porque el AuthService tiene el método isAuthenticated()
  if (auth.isAuthenticated()) return true; 
  
  // Guarda la url solicitada para navegación después del login
  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};