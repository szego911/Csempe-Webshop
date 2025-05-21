import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SyncService } from './services/sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule, CommonModule],
  template: `
    <app-header />

    <router-outlet />

    <!-- Telepítés gomb -->
    <button
      *ngIf="showInstallButton"
      (click)="installApp()"
      class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 z-50"
    >
      Telepítés
    </button>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  deferredPrompt: any = null;
  showInstallButton = false;

  constructor(private syncService: SyncService) {}
  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });

    if (navigator.onLine) {
      this.syncService.refreshCarsFromFirestore();
      this.syncService.refreshRentalsFromFirestore();
    }
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA telepítve ✅');
        } else {
          console.log('PWA telepítés elutasítva ❌');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }
}
