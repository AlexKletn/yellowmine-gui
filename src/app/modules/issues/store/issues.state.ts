import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IssuesStoreState } from './types';
import { SetSettingsKanban } from './issues.actions/SetSettingsKanban';
import { Injectable } from '@angular/core';

type IssuesStateContext = StateContext<IssuesStoreState>;

@State<IssuesStoreState>({
  name: 'issues',
  defaults: {
    settings: {
      kanban: {
        activeIssueStatuses: [],
      },
      kanbanFilters: {
        model: {
          isMy: true,
        },
      },
    },
  },
})
@Injectable()
export default class IssuesState {
  @Selector()
  static activeIssueStatuses(state: IssuesStoreState) {
    return state.settings.kanban.activeIssueStatuses ?? [];
  }

  @Selector()
  static currentFilter(state: IssuesStoreState) {
    return state.settings.kanbanFilters.model ?? {};
  }

  @Action(SetSettingsKanban)
  setSettingsKanban(ctx: IssuesStateContext, { settingsKanban }: SetSettingsKanban) {
    ctx.setState({
      settings: {
        kanbanFilters: ctx.getState().settings.kanbanFilters,
        kanban: settingsKanban,
      },
    });
  }
}
