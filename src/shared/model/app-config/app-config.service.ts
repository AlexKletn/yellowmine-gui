import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';

import { AppConfigState } from '@shared/model/app-config';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private store = inject(Store);

  private scheme = toSignal(
    this.store.select(AppConfigState.scheme),
  );

  private accent = toSignal(
    this.store.select(AppConfigState.accent),
  );

  constructor() {
    effect(() => {
      const scheme = this.scheme();
      const accent = this.accent();

      document.documentElement.style.setProperty('--primary', accent ?? '');

      if (scheme === 'dark') {
        document.documentElement.classList.add('p-dark');
      }
      else {
        document.documentElement.classList.remove('p-dark');
      }
    });
  }
}
