import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RedmineConfigStoreState } from './types';
import { SetTokenAction } from './actions/setToken.action';
import { SetRedmineUrlAction } from './actions/setRedmineUrl.action';

type RedmineConfigStore = StateContext<RedmineConfigStoreState>;

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
