import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  template: `
    <button
      (click)="logout()"
      class="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
    >
      Kijelentkezés
    </button>
  `,
})
export class LogoutButtonComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
