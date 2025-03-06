import { Component } from '@angular/core';

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

  logout() {
    // Implement logout logic here
    console.log('User logged out');
  }
}
