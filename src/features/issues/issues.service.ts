import { HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeMap } from 'rxjs';

import Issue from '@entities/issues/model/types';
import { RedmineApi } from '@shared/api/redmine-api';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { BaseResponse } from '@shared/api/redmine-api/types';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private redmineApi = inject(RedmineApi);

  issues(filter: RequestFilter) {
    filter.make();

    return toSignal(
      filter
        .pipe(
          mergeMap(filter => this.redmineApi.get<BaseResponse<{ issues: Issue[] }>>('/redmine/issues.json', {
            params: filter as unknown as HttpParams,
          })),
        ),
    );
  }

  issue(id: Signal<Issue['id']>) {
    const issueSignal = signal<Issue | undefined>(undefined);

    effect(() => {
      this.redmineApi.get<{ issue: Issue }>(`/redmine/issues/${id()}.json`, {
        params: {
          include: ['relations', 'journals', 'attachments'].join(','),
        },
      })
        .subscribe(({ issue }) => issueSignal.set(issue));
    });

    return issueSignal;
  }
}
