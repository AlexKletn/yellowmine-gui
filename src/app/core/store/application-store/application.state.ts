import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import SetThemeAction from './actions/set-theme.action';
import { ApplicationStoreState } from './types';

type ApplicationConfigStore = StateContext<ApplicationStoreState>;

@State<ApplicationStoreState>({
  name: 'application',
  defaults: {
    currentTheme: 'light',
  },
})
@Injectable()
export default class ApplicationState {
  @Selector()
  static currentTheme(state: ApplicationStoreState) {
    return state.currentTheme;
  }

  @Action(SetThemeAction)
  setTheme(ctx: ApplicationConfigStore, action: SetThemeAction) {
    ctx.setState({
      currentTheme: action.theme,
    });
  }
}
