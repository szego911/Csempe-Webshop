import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,FormsModule],
  template: `
    <app-header />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {}
