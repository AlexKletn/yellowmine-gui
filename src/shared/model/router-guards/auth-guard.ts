import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';

import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

const hasAuth = async () => {
  return firstValueFrom(inject(Store).select(RedmineConfigState.isAuth));
};

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const isAuth = await hasAuth();

  if (!isAuth) {
    return router.parseUrl('/login');
  }
  return true;
};

export const dontAuthGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const isAuth = await hasAuth();

  if (isAuth) {
    return router.parseUrl('/issues');
  }
  return true;
};
