import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="flex pt-10 min-h-full flex-col bg-neutral-100 px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          class="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2
          class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
          Fiók létrehozása
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" (ngSubmit)="onSubmit()">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email-cím</label
            >
            <div class="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                required
                [(ngModel)]="email"
                class="block w-full rounded-md bg-white shadow-lg px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                ngModel
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Jelszó</label
            >
            <div class="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                required
                [(ngModel)]="password"
                class="block w-full rounded-md bg-white shadow-lg px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                ngModel
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Regisztráció
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Van már fiókod?
          <a
            routerLink="/login"
            class="font-semibold text-blue-600 hover:text-blue-500"
            >Lépj be!</a
          >
        </p>
      </div>
    </div>
  `,
  styles: ``,
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/']); // vagy bárhova be szeretnéd irányítani
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
    }
  }
}
