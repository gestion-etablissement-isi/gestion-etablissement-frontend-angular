import { Injectable } from '@angular/core';
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService extends KeycloakAngularService {
  constructor() {
    super();
  }
}