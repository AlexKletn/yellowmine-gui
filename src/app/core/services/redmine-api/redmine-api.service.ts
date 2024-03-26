import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import RedmineConfigService from '../redmine-config/redmine-config.service';
import RedmineConfigState from '../redmine-config/store/redmine-config.state';
import { Select } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class RedmineHandler extends HttpHandler {
  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  private apiKey?: string;

  constructor(private redmineConfig: RedmineConfigService, private httpHandler: HttpHandler) {
    super();

    this.apiKey$.subscribe((key) => {
      this.apiKey = key;
    });
  }

  override handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (!this.apiKey) {
      throw new Error('No API key provided');
    }

    const headers = req.headers
      .set('X-Redmine-API-Key', this.apiKey);

    const redmineReq = req.clone({
      headers,
    });

    return this.httpHandler.handle(redmineReq);
  }
}

@Injectable({ providedIn: 'root' })
class RedmineApiService extends HttpClient {
  constructor(private redmineHandler: RedmineHandler) {
    super(redmineHandler);
  }
}

export default RedmineApiService;
