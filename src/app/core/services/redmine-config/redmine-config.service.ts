import { inject, Injectable } from '@angular/core';
import RedmineApiService from '../redmine-api/redmine-api.service';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
class RedmineConfigService {
  private redmineApiService = inject(RedmineApiService);

  constructor() {
  }

  async getRedmineUrl() {
    const request = this.redmineApiService.get<{ url: string }>('api/redmine-url');

    return lastValueFrom(request);
  }
}

export default RedmineConfigService;
