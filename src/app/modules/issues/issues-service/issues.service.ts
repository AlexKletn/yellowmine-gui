import { Injectable } from '@angular/core';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { RequestFilterMaker } from '../../../core/services/redmine-api/Pagination.request';
import { Store } from '@ngxs/store';
import { IssueResponse, IssuesResponse, IssueUpdateRequest } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import textile from 'textile-js';
import linkifyHtml from 'linkify-html';
import _ from 'lodash';

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
    return this.redmineApi.get<IssuesResponse>(`api/projects/${this.activeProject ?? 0}/issues.json`, {
      params: filter?.make() ?? undefined,
    });
  }

  getIssue(id: number) {
    return this.redmineApi.get<IssueResponse>(`api/issues/${id}.json`);
  }

  updateIssue({ id, ...issue }: IssueUpdateRequest) {
    // const request: IssueUpdateRequest = {
    //   ...issue,
    //
    //   project_id: project.id,
    //   tracker_id: tracker.id,
    //   status_id: status.id,
    //   priority_id: priority.id,
    //   assigned_to_id: assigned_to?.id,
    // };

    return this.redmineApi.put<IssueResponse>(`api/issues/${id}.json`, { issue });
  }

  parseDescription(description: string) {
    return linkifyHtml(textile(description), {
      attributes: {
        target: '_blank',
      },
      format: {
        url: (value) => {
          const url = new URL(value);

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
