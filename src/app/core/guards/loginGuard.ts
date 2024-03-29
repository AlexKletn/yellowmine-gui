import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import RedmineConfigState from '../services/redmine-config/store/redmine-config.state';
import { map } from 'rxjs';

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const redmineConfigStore = inject(Store);
  const router = inject(Router);

  const apiKey$ = redmineConfigStore.select(RedmineConfigState.apiKey).pipe(
    map((state) => {
      if (!state) {
        router.navigate(['/login']);
      }

      return !!state;
    }),
  );

  return apiKey$;
};

export const dontLoginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const redmineConfigStore = inject(Store);
  const router = inject(Router);

  const apiKey$ = redmineConfigStore.select(RedmineConfigState.apiKey).pipe(
    map((state) => {
      if (state) {
        router.navigate(['/issues']);
      }

      return !state;
    }),
  );

  return apiKey$;
};
