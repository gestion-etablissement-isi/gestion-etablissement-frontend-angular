import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    avatar: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=4A77B4&color=fff'
  };

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout()
      .then(() => {
        console.log('Déconnexion réussie');
      })
      .catch(error => {
        console.error('Erreur lors de la déconnexion', error);
      });
  }
}
