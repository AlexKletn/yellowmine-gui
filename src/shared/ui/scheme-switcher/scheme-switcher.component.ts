import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { AppConfigState } from '@shared/model/app-config';
import { SetSchemeAction } from '@shared/model/app-config/store/actions/setScheme.action';

@Component({
  selector: 'ym-scheme-switcher',
  standalone: true,
  imports: [
    ButtonModule,
    Ripple,
  ],
  templateUrl: './scheme-switcher.component.html',
  styleUrl: './scheme-switcher.component.scss',
})
export class SchemeSwitcherComponent {
  private store = inject(Store);
  private scheme = toSignal(
    this.store.select(AppConfigState.scheme),
  );

  icon = computed(() => (
    this.scheme() === 'light' ? 'pi pi-sun' : 'pi pi-moon'
  ));

  switchScheme() {
    const currentScheme = this.scheme();

    this.store.dispatch(new SetSchemeAction(
      currentScheme === 'light' ? 'dark' : 'light',
    ));
  }
}
