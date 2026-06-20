import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../firebase/auth.service';

/** Blocks app routes until the user completes the login page this session. */
export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await authService.waitForAuthResolution();

  if (user && authService.hasActiveAppSession()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/** Sends users who already completed login away from the login page. */
export const redirectIfAuthenticatedGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await authService.waitForAuthResolution();

  if (user && authService.hasActiveAppSession()) {
    return router.parseUrl('/market-watch');
  }

  return true;
};
