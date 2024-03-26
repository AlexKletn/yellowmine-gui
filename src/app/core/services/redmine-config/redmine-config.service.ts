import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
class RedmineConfigService {
  private redmineUrl?: string;

  addRedmineUrl(url: string) {
    this.redmineUrl = url;

    return this.redmineUrl;
  }

  getRedmineUrl() {
    return this.redmineUrl;
  }
}

export default RedmineConfigService;
