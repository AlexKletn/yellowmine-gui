import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SetRedmineUrlAction } from '@shared/model/redmine-config/store/actions/setRedmineUrl.action';
import { SetTokenAction } from '@shared/model/redmine-config/store/actions/setToken.action';

import { RedmineConfigStoreState } from './types';

type RedmineConfigStore = StateContext<RedmineConfigStoreState>;

@Injectable()
@State<RedmineConfigStoreState>({
  name: 'redmineConfig',
  defaults: {
  },
})
export default class RedmineConfigState {
  @Selector()
  static apiKey(state: RedmineConfigStoreState) {
    return state.apiKey;
  }

  @Selector()
  static isAuth(state: RedmineConfigStoreState) {
    return !!state.apiKey;
  }

  @Selector()
  static redmineUrl(state: RedmineConfigStoreState) {
    return state.redmineUrl;
  }

  @Action(SetTokenAction)
  setToken(ctx: RedmineConfigStore, action: SetTokenAction) {
    ctx.setState({
      ...ctx.getState(),

      apiKey: action.token,
    });
  }

  @Action(SetRedmineUrlAction)
  setRedmineUrl(ctx: RedmineConfigStore, action: SetRedmineUrlAction) {
    ctx.setState({
      ...ctx.getState(),

      redmineUrl: action.redmineUrl,
    });
  }
}
