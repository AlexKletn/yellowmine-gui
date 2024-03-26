import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { SetIssueStatuses } from '../store/issueStatuses.actions';
import { Observable } from 'rxjs';
import { IssueStatus } from '../domain/IssueStatus';
import { IssueStatusesResponse } from './types';

@Injectable({ providedIn: 'root' })
class IssueStatusesService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  @Select(state => state.issueStatuses.items)
  issueStatuses!: Observable<IssueStatus[]>;

  constructor(private redmineApi: RedmineApiService, private store: Store) {
    this.loadIssueStatuses();
  }

  loadIssueStatuses() {
    this.redmineApi.get<IssueStatusesResponse>('/api/issue_statuses.json').subscribe({
      next: ({ issue_statuses }) => {
        this.store.dispatch(new SetIssueStatuses(issue_statuses));
      },
    });
  }
}

export default IssueStatusesService;
