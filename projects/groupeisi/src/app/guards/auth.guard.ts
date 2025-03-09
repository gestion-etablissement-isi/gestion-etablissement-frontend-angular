// src/app/guards/auth.guard.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard } from 'keycloak-angular';
import { KeycloakService } from '../services/keycloak/keycloak.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  private platformId = inject(PLATFORM_ID);

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot
  ): Promise<boolean> {
    // Vérifier si nous sommes dans un navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Autorise l'accès en SSR
    }

    if (!this.authenticated) {
      await this.keycloak.login();
      return false;
    }

    const requiredRoles = route.data['roles'];
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role: string) => this.roles.includes(role));
  }
}