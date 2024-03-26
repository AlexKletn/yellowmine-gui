import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IssueStatusesStoreState } from './types';
import { SetIssueStatuses } from './issueStatuses.actions';

type ProjectsStateContext = StateContext<IssueStatusesStoreState>;

@State<IssueStatusesStoreState>({
  name: 'issueStatuses',
  defaults: {
    items: [],
  },
})
@Injectable()
export default class IssueStatusesState {
  @Action(SetIssueStatuses)
  setIssueStatuses(ctx: ProjectsStateContext, action: SetIssueStatuses) {
    ctx.setState({
      ...ctx.getState(),

      items: action.items,
    });
  }
}
