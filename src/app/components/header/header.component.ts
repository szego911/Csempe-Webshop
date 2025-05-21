import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoutButtonComponent } from '../logOutButton/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LogoutButtonComponent, AsyncPipe, NgIf],
  template: `
    <div>
      <div
        class="bg-slate-100 px-4 py-3 shadow-md flex justify-between items-center"
      >
        <button class="text-2xl font-bold" routerLink="/">CityRides</button>

        <!-- Hamburger ikon mobilra -->
        <button class="sm:hidden text-2xl" (click)="isOpen = !isOpen">☰</button>

        <!-- Navigációs linkek - desktop -->
        <div class="hidden sm:flex gap-6 text-lg">
          <a routerLink="/home">Főoldal</a>
          <a routerLink="/cars">Autóink</a>

          <ng-container
            *ngIf="authService.currentUser$ | async as user; else notLoggedIn"
          >
            <a routerLink="/profil">Profil</a>
            <a routerLink="/admin">Admin</a>
            <app-logout-button></app-logout-button>
          </ng-container>
          <ng-template #notLoggedIn>
            <a routerLink="/login">Bejelentkezés</a>
            <a routerLink="/register">Regisztráció</a>
          </ng-template>
        </div>
      </div>

      <!-- Mobil menü -->
      <div
        *ngIf="isOpen"
        class="sm:hidden flex flex-col gap-2 px-4 py-2 bg-slate-100 shadow-md text-lg"
      >
        <a routerLink="/home">Főoldal</a>
        <a routerLink="/cars">Autóink</a>

        <ng-container
          *ngIf="
            authService.currentUser$ | async as user;
            else notLoggedInMobile
          "
        >
          <a routerLink="/profil">Profil</a>
          <a routerLink="/admin">Admin</a>
          <app-logout-button></app-logout-button>
        </ng-container>
        <ng-template #notLoggedInMobile>
          <a routerLink="/login">Bejelentkezés</a>
          <a routerLink="/register">Regisztráció</a>
        </ng-template>
      </div>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {
  isOpen = false;
  constructor(public authService: AuthService) {}
}
