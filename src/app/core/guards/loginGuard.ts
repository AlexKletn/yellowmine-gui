import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import RedmineConfigState from '../services/redmine-config/store/redmine-config.state';
import { map } from 'rxjs';

export const loginGuard: CanActivateFn = () => {
  const redmineConfigStore = inject(Store);
  const router = inject(Router);

  return redmineConfigStore.select(RedmineConfigState.apiKey).pipe(
    map((state) => {
      if (!state) {
        router.navigate(['/login']);
      }

      return !!state;
    }),
  );
};

export const dontLoginGuard: CanActivateFn = () => {
  const redmineConfigStore = inject(Store);
  const router = inject(Router);

  return redmineConfigStore.select(RedmineConfigState.apiKey).pipe(
    map((state) => {
      if (state) {
        router.navigate(['/projects']);
      }

      return !state;
    }),
  );
};
