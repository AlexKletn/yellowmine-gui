import { inject, Injectable } from '@angular/core';
import RedmineApiService from '../redmine-api/redmine-api.service';
import { lastValueFrom, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
class RedmineConfigService {
  private redmineApiService = inject(RedmineApiService);
  redmineUrl: Subject<string> = new Subject<string>();

  constructor() {
    this.getRedmineUrl().then(({ url }) => {
      this.redmineUrl?.next(url);
    });
  }

  async getRedmineUrl() {
    const request = this.redmineApiService.get<{ url: string }>('api/redmine-url');

    return lastValueFrom(request);
  }
}

export default RedmineConfigService;
