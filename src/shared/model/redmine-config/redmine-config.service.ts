import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';

import { RedmineApi } from '@shared/api/redmine-api';
import { RedmineConfigState, SetRedmineUrlAction, SetTokenAction } from '@shared/model/redmine-config/store';

@Injectable({
  providedIn: 'root',
})
export class RedmineConfigService {
  private store: Store = inject(Store);
  private redmineApi = inject(RedmineApi);

  getRedmineUrl = toSignal(
    this.store.select(RedmineConfigState.redmineUrl),
  );

  isAuth = toSignal(
    this.store.select(RedmineConfigState.isAuth),
    { initialValue: false },
  );

  constructor(
  ) {
    this.fetchRedmineUrl();
  }

  saveApiKey(key: string) {
    this.store.dispatch(new SetTokenAction(key));
  }

  logout() {
    this.store.dispatch(new SetTokenAction(undefined));
  }

  private fetchRedmineUrl() {
    this.redmineApi.get<{ url: string }>('/config/url').subscribe(({ url }) => {
      this.store.dispatch(new SetRedmineUrlAction(url));
    });
  }
}
