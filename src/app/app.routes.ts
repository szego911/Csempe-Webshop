import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'profil',
    loadComponent: () =>
      import('./pages/profil/profil.component').then((m) => m.ProfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'cars',
    loadComponent: () =>
      import('./pages/car-list/car-list.component').then(
        (m) => m.CarListComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/car-management/car-manager.component').then(
        (m) => m.CarManagerComponent
      ),
    canActivate: [authGuard],
  },
];
