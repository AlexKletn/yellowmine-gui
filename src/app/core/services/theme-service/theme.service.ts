import { inject, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import ApplicationState from '../../store/application-store/application.state';
import SetThemeAction from '../../store/application-store/actions/set-theme.action';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private store = inject(Store);

  @Select(ApplicationState.currentTheme)
  currentTheme$!: Observable<string>;

  currentTheme?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.currentTheme$.subscribe((value: string) => {
      this.currentTheme = value;

      this.setTheme(value);
    });
  }

  switchTheme(theme: string) {
    this.store.dispatch(new SetThemeAction(theme));
  }

  private setTheme(theme: string) {
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
}
