import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnexionComponent } from './features/auth/components/connexion/connexion.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { InscriptionComponent } from './features/auth/components/inscription/inscription.component';
import { AuthService } from './services/auth/auth.service';
@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ReactiveFormsModule,
        CommonModule,
        
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'groupeisi';
  isLoggedIn = false;
  userProfile: any = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.getUserProfile().subscribe(profile => {
      this.userProfile = profile;
    });
  }

  login() {
    if (this.authService) {
      this.authService.login();
    } else {
      console.error('AuthService is not defined.');
    }
  }

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
