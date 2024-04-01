import { inject, Injectable } from '@angular/core';
import RedmineApiService from '../redmine-api/redmine-api.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import RedmineConfigState from './store/redmine-config.state';
import { SetRedmineUrlAction } from './store/actions/setRedmineUrl.action';

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
