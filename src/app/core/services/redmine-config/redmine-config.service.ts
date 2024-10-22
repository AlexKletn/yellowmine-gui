import { inject, Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';
import { SetRedmineUrlAction } from '@shared/model/redmine-config/store/actions/setRedmineUrl.action';
import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

@Injectable({ providedIn: 'root' })
class RedmineConfigService {
  private store = inject(Store);

  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  private redmineApiService = inject(RedmineApiService);

  constructor() {
    this.apiKey$.subscribe((key) => {
      if (key) {
        this.getRedmineUrl().subscribe(({ url }) => {
          this.store.dispatch(new SetRedmineUrlAction(url));
        });
      }
    });
  }

  getRedmineUrl() {
    return this.redmineApiService.get<{ url: string }>('api/redmine-url');
  }
}

export default RedmineConfigService;
