import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ApplicationStoreState } from './types';
import { Injectable } from '@angular/core';
import SetThemeAction from './actions/set-theme.action';

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
