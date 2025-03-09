// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { from, of, switchMap } from 'rxjs';
import { KeycloakService } from '../services/keycloak/keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  const platformId = inject(PLATFORM_ID);
  
  // Vérifier si nous sommes dans un navigateur
  if (isPlatformBrowser(platformId) && keycloak.isLoggedIn()) {
    return from(keycloak.getToken()).pipe(
      switchMap(token => {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
      })
    );
  }
  
  return next(req);
};