import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PuterService } from '../services/puter.service';

export const authGuard: CanActivateFn = (route, state) => {
  const puterService = inject(PuterService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const isAuthenticated = puterService.isAuthenticated();

    console.log('Guard (Navegador):', isAuthenticated ? 'Autenticado' : 'Não Autenticado');

    if (isAuthenticated) {
      return true;
    } else {
      return router.navigateByUrl('/').then(() => false);
    }
  } else {
    return true;
  }
};
