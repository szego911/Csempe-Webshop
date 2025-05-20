import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { CarListComponent } from './pages/car-list/car-list.component';
import { CarManagerComponent } from './pages/admin/car-management/car-manager.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'cars',
    component: CarListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: CarManagerComponent,
    canActivate: [authGuard],
  },
];
