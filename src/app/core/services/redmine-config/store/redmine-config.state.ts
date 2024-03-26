import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RedmineConfigStoreState } from './types';
import { SetTokenAction } from './actions/setToken.action';

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

  @Action(SetTokenAction)
  setToken(ctx: RedmineConfigStore, action: SetTokenAction) {
    ctx.setState({
      apiKey: action.token,
    });
  }
}
