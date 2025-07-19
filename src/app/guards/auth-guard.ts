import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {PuterService} from '../services/puter.service';

export const authGuard: CanActivateFn = (route, state) => {
  const puterService = inject(PuterService);
  const router = inject(Router);

  if (!puterService.isAuthenticated()) {
    return router.navigateByUrl('/auth').then(() => false);
  }

  return true;

};
