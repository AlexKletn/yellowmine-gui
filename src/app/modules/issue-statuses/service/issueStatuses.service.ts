import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';
import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

import { IssueStatus } from '../domain/IssueStatus';
import { SetIssueStatuses } from '../store/issueStatuses.actions';

import { IssueStatusesResponse } from './types';

@Injectable({ providedIn: 'root' })
class IssueStatusesService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  @Select(state => state.issueStatuses.items)
  issueStatuses!: Observable<IssueStatus[]>;

  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  constructor(private redmineApi: RedmineApiService, private store: Store) {
    this.apiKey$.subscribe((key) => {
      if (key) {
        this.loadIssueStatuses();
      }
    });
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
