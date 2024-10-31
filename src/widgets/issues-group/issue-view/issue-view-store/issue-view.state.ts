import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { ToggleSidebarAction } from '@widgets/issues-group/issue-view/issue-view-store/actions/toggle-sidebar.action';

import { IssueView } from './types';

type AppConfigStore = StateContext<IssueView>;

@Injectable()
@State<IssueView>({
  name: 'issueView',
  defaults: {
    sidebarHidden: false,
  },
})
export class IssueViewState {
  @Selector()
  static sidebarHidden(state: IssueView) {
    return state.sidebarHidden;
  }

  @Action(ToggleSidebarAction)
  toggleSidebar(ctx: AppConfigStore) {
    ctx.patchState({
      sidebarHidden: !ctx.getState().sidebarHidden,
    });
  }
}
