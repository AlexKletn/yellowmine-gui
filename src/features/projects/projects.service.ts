import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeMap } from 'rxjs';

import Project from '@entities/projects/model/types';
import { RedmineApi } from '@shared/api/redmine-api';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { BaseResponse } from '@shared/api/redmine-api/types';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private redmineApi = inject(RedmineApi);

  projects(filter: RequestFilter) {
    filter.make();

    return toSignal(
      filter
        .pipe(
          mergeMap(filter => this.redmineApi.get<BaseResponse<{ projects: Project[] }>>('/redmine/projects.json', {
            params: filter as unknown as HttpParams,
          })),
        ),
    );
  }
}
