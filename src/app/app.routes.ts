import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'ofertas', loadComponent: () => import('./pages/ofertas/ofertas.page').then(m => m.OfertasPage), canActivate: [authGuard] },
  { path: 'mascotas', loadComponent: () => import('./pages/mascotas/mascotas.page').then(m => m.MascotasPage), canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];
