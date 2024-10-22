import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

@Injectable({ providedIn: 'root' })
export class RedmineHandler extends HttpHandler {
  private apiKey$: Observable<string | undefined> = inject(Store).select(RedmineConfigState.apiKey);

  private apiKey: Signal<string | undefined> = toSignal(this.apiKey$, { initialValue: '' });

  constructor(private httpHandler: HttpHandler) {
    super();
  }

  override handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const apiKey = this.apiKey();

    const headers = new HttpHeaders({
      'x-redmine-api-key': apiKey!,
    });

    const redmineReq = req.clone({
      url: `/api/${req.url}`.replace(/\/+/g, '/'),
      headers,
    });

    return this.httpHandler.handle(redmineReq);
  }
}

@Injectable({ providedIn: 'root' })
class RedmineApiService extends HttpClient {
  constructor(redmineHandler: RedmineHandler) {
    super(redmineHandler);
  }
}

export default RedmineApiService;
