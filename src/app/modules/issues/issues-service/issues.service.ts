import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import linkifyHtml from 'linkify-html';
import _ from 'lodash';
import { forkJoin, map } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import textile from 'textile-js';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';
import { RequestFilterMaker } from '@shared/api/redmine-api/RequestFilter';

import { IssueResponse, IssuesResponse, IssueUpdateRequest } from './types';

@Injectable({ providedIn: 'root' })
class IssuesService {
  private activeProject?: string;

  constructor(private redmineApi: RedmineApiService, private store: Store) {
    this.store.select(({ projects }) =>
      projects.activeProject,
    ).subscribe({
      next: (value) => {
        this.activeProject = value;
      },
    });
  }

  getIssues(filter?: RequestFilterMaker) {
    if (this.activeProject) {
      filter?.setFilter('project_id', this.activeProject);
    }

    return this.redmineApi.get<IssuesResponse>('api/issues.json', {
      params: filter?.make() ?? undefined,
    });
  }

  getProjectIssues(filter?: RequestFilterMaker) {
    if (!this.activeProject) {
      return this.getIssues(filter);
    }

    const {
      assigned_to_ids,

      ...filters
    } = filter?.make() ?? {};

    if ((assigned_to_ids as Array<string>)?.length > 0 && filters['assigned_to_id'] !== 'me') {
      const requests = (assigned_to_ids as Array<string>).map(id => (
        this.redmineApi.get<IssuesResponse>(`api/projects/${this.activeProject ?? 0}/issues.json`, {
          params: {
            ...filters,
            assigned_to_id: id,
          },
        })
      ));

      return (forkJoin(requests))
        .pipe(
          map((responses) => {
            return responses.reduce((acc, value) => {
              return {
                issues: [...acc.issues, ...value.issues],
                total_count: acc.total_count + value.total_count,
              };
            }, { issues: [], total_count: 0 } as IssuesResponse);
          }),
        );
    }

    return this.redmineApi.get<IssuesResponse>(`api/projects/${this.activeProject ?? 0}/issues.json`, {
      params: filters,
    });
  }

  getIssue(id: number) {
    return this.redmineApi.get<IssueResponse>(`api/issues/${id}.json`);
  }

  updateIssue({ id, ...issue }: IssueUpdateRequest) {
    return this.redmineApi.put<IssueResponse>(`api/issues/${id}.json`, { issue });
  }

  parseDescription(description: string) {
    return linkifyHtml(textile(description), {
      attributes: {
        target: '_blank',
      },
      validate: {
        url: (value) => {
          return /^https?:\/\//.test(value);
        },
      },
      format: {
        url: (value) => {
          let url;

          try {
            url = new URL(value);
          }
          catch (e) {
            return value;
          }

          const host = url.hostname.replace('www.', '');

          if (host === 'figma') {
            return 'Макет в Figma';
          }
          if (/gitlab/.test(host)) {
            return 'Gitlab/' + url.pathname.replace(/^.+?\/([\w-]+)($|(\/-))/i, '$1');
          }
          if (/swagger/.test(url.pathname)) {
            return host + '/Swagger';
          }

          return _.capitalize(host);
        },
        target: '_blank',
      },
    });
  }
}

export default IssuesService;
