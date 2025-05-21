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
    <div
      class="bg-slate-100 px-4 py-3 shadow-md flex justify-between items-center"
    >
      <button class="text-2xl" routerLink="/">CityRides</button>
      <div class="flex gap-10 sm:gap-4 text-lg">
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
  `,
  styles: ``,
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
