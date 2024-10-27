import { HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeMap, tap } from 'rxjs';

import Issue from '@entities/issues/model/types';
import { RedmineApi } from '@shared/api/redmine-api';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { BaseResponse, DefinitionRecord } from '@shared/api/redmine-api/types';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private redmineApi = inject(RedmineApi);

  issues(filter: RequestFilter, isLoading?: WritableSignal<boolean>) {
    filter.make();

    return toSignal(
      filter
        .pipe(
          tap(() => isLoading?.set(true)),
          mergeMap(
            filter => (
              this.redmineApi.get<BaseResponse<{ issues: Issue[] }>>('/redmine/issues.json', {
                params: filter as unknown as HttpParams,
              },
              ).pipe(
                tap(() => isLoading?.set(false)),
              )
            ),
          ),
        ),
    );
  }

  issue(id: Signal<Issue['id']>, isLoading?: WritableSignal<boolean>) {
    const issueSignal = signal<Issue | undefined>(undefined);
    isLoading?.set(true);

    effect(() => {
      this.redmineApi.get<{ issue: Issue }>(`/redmine/issues/${id()}.json`, {
        params: {
          include: ['relations', 'journals', 'attachments'].join(','),
        },
      })
        .pipe(
          tap(() => isLoading?.set(false)),
        )
        .subscribe(({ issue }) => issueSignal.set(issue));
    });

    return issueSignal;
  }

  statuses() {
    return toSignal(
      this.redmineApi.get<{ issue_statuses: DefinitionRecord[] }>('/redmine/issue_statuses.json'),
    );
  }
}
