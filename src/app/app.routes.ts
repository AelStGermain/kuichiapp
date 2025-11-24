import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redirección de la raíz a login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta de Login (sin tabs)
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

  // Tabs (contenedor principal para rutas autenticadas)
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'mascotas',
        loadComponent: () => import('./pages/mascotas/mascotas.page').then(m => m.MascotasPage)
      },
      {
        path: 'veterinarias',
        loadComponent: () => import('./pages/veterinarias/veterinarias.page').then(m => m.VeterinariasPage)
      },
      {
        path: 'ofertas',
        loadComponent: () => import('./pages/ofertas/ofertas.page').then(m => m.OfertasPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // Ruta comodín
  { path: '**', redirectTo: 'login' }
];