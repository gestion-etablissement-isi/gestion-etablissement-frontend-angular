// src/app/services/keycloak/keycloak-init.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from './keycloak.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {
  private platformId = inject(PLATFORM_ID);

  constructor(private keycloak: KeycloakService) {}

  init(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Keycloak init started...');
      return this.keycloak.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId
        },
        initOptions: {
          onLoad: 'login-required',  // Remplace 'check-sso' par 'login-required' pour forcer la connexion
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
        }
      }).then(authenticated => {
        console.log('Keycloak authenticated:', authenticated);
        return authenticated;
      }).catch(error => {
        console.error('Keycloak init failed:', error);
        return false;
      });
    } else {
      return Promise.resolve(false);
    }
  }
  
}
