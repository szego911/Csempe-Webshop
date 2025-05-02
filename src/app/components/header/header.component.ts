import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { LogoutButtonComponent } from "../logOutButton/logout-button.component";

@Component({
  selector: 'app-header',
  imports: [PrimaryButtonComponent, RouterLink, LogoutButtonComponent],
  template: `
    <div
      class="bg-slate-100 px-4 py-3 shadow-md flex justify-between items-center"
    >
      <button class="text-2xl" routerLink="/">CityRides</button>
      <div class="flex gap-10 sm:gap-4 text-lg">
        <a routerLink="/home">Főoldal</a>
        <a routerLink="/products">Termékek</a>
        <a routerLink="/cars">Autóink</a>
        <a routerLink="/login">Bejelentkezés</a>
        <a routerLink="/register">Regisztráció</a>
        <app-logout-button></app-logout-button>
        <a routerLink="/profil">Profil</a>
      </div>

      <app-primary-button label="{{ cartLabel() }}" routerLink="/cart" />
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {
  cartService = inject(CartService);

  cartLabel = computed(() => `Kosár (${this.cartService.cart().length})`);
}
