// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak!: Keycloak;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private userProfile = new BehaviorSubject<any>(null);

  constructor() {
    this.init();
  }

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });

      this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      }).then(authenticated => {
        this.isAuthenticated.next(authenticated);
        if (authenticated) {
          this.loadUserProfile();
        }
        resolve(authenticated);
      }).catch(error => {
        reject(error);
      });
    });
  }

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    if (!this.keycloak) {
      console.error('Keycloak is not initialized.');
      return Promise.reject('Keycloak is not initialized.');
    }
    const redirectUri = window.location.origin;
    console.log('Déconnexion en cours, redirection vers :', redirectUri);
    return this.keycloak.logout({ redirectUri });
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.keycloak.token) {
        this.keycloak.updateToken(30)
          .then(() => resolve(this.keycloak.token as string))
          .catch(error => reject(error));
      } else {
        reject('Not authenticated');
      }
    });
  }

  private loadUserProfile(): void {
    this.keycloak.loadUserProfile()
      .then(profile => {
        this.userProfile.next(profile);
      })
      .catch(error => console.error('Failed to load user profile', error));
  }

  getUserProfile(): Observable<any> {
    return this.userProfile.asObservable();
  }
}
