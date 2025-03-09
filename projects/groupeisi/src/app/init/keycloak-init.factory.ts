// src/app/services/keycloak/keycloak-init.factory.ts
import { KeycloakInitService } from "../services/keycloak/keycloak-init.service";

export function initializeKeycloak(keycloakInit: KeycloakInitService) {
  return () => {
    try {
      return keycloakInit.init();
    } catch (error) {
      console.error('Keycloak initialization error:', error);
      return Promise.resolve(false);
    }
  };
}