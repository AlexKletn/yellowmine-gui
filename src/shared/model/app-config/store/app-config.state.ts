import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SetAccentAction } from '@shared/model/app-config/store/actions/setAccent.action';

import { SetSchemeAction } from './actions/setScheme.action';
import { AppConfig } from './types';

type AppConfigStore = StateContext<AppConfig>;

@Injectable()
@State<AppConfig>({
  name: 'appConfig',
  defaults: {
    scheme: 'auto',
    accent: '#c22bec',
  },
})
class AppConfigState {
  @Selector()
  static scheme(state: AppConfig) {
    return state.scheme;
  }

  @Selector()
  static accent(state: AppConfig) {
    return state.accent;
  }

  @Action(SetSchemeAction)
  setScheme(ctx: AppConfigStore, action: SetSchemeAction) {
    ctx.patchState({ scheme: action.scheme });
  }

  @Action(SetAccentAction)
  setAccent(ctx: AppConfigStore, action: SetAccentAction) {
    ctx.patchState({ accent: action.accent });
  }
}

export default AppConfigState;
