// src/app/services/keycloak/keycloak-init.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { KeycloakService } from './keycloak.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {
  private platformId = inject(PLATFORM_ID);
  
  constructor(private keycloak: KeycloakService) {}

  init(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      return this.keycloak.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
        }
      });
    } else {
      return Promise.resolve(false);
    }
  }
}