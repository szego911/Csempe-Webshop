import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: 'profil.component.html',
  styles: ``,
})
export class ProfilComponent {
  constructor(private authservice: AuthService) {}
  currentUser: any;
  ngOnInit() {
    this.currentUser = this.authservice.getCurrentUser();
  }
}
