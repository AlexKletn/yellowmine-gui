import { inject, Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, combineLatestWith, Observable, Subject } from 'rxjs';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';
import { RequestFilterMaker } from '@shared/api/redmine-api/RequestFilter';
import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

import { Membership } from '../domain/Membership';
import Project from '../domain/Project';
import { SetMembershipsAction } from '../store/projects.actions/set-memberships.action';
import ProjectsState from '../store/projects.state';

import { ProjectMembershipsResponse } from './types';

const LIMIT = 100;

@Injectable()
export default class ProjectMembershipsService {
  private membershipsFilter: RequestFilterMaker = new RequestFilterMaker(0, LIMIT);
  private store = inject(Store);
  private redmineApi = inject(RedmineApiService);

  @Select(ProjectsState.memberships)
  memberships$!: Observable<Membership[]>;

  @Select(ProjectsState.activeProject)
  private activeProject$!: Observable<Project['id']>;

  private activeProject?: Project['id'];

  @Select(RedmineConfigState.apiKey)
  private redmineApiKey$!: Observable<string>;

  totalCount$: Subject<number> = new Subject();
  totalCount: number = 0;

  constructor() {
    this.redmineApiKey$
      .pipe(
        combineLatestWith(this.activeProject$),
      )
      .subscribe(([apiKey, activeProject]) => {
        this.activeProject = activeProject;

        if (apiKey) {
          this.getTotalCount();
        }
      });
    this.loadAllMemberships();
  }

  private loadAllMemberships() {
    this.totalCount$.subscribe((t) => {
      this.totalCount = t;

      const pages = this.totalCount / LIMIT;

      const requests = [];

      for (let i = 0; i < pages; i++) {
        this.membershipsFilter.setOffsetPagination(i * LIMIT, LIMIT);
        const request = this.loadMemberships(this.membershipsFilter.make());

        requests.push(request);
      }

      (combineLatest(requests)).subscribe((res) => {
        const membershipsAll = res
          .reduce((acc, { memberships }) => ([...acc, ...memberships]), [] as Membership[])
          .filter(({ user }) => !!user);

        this.store.dispatch(new SetMembershipsAction(membershipsAll));
      });
    });
  }

  private loadMemberships(filter: ReturnType<RequestFilterMaker['make']>) {
    return this.redmineApi.get<ProjectMembershipsResponse>(`api/projects/${this.activeProject}/memberships.json`, {
      params: filter,
    });
  }

  private getTotalCount() {
    this.redmineApi.get<ProjectMembershipsResponse>(`api/projects/${this.activeProject}/memberships.json`, {
      params: this.membershipsFilter.make(),
    }).subscribe(({ total_count }) => {
      this.totalCount$.next(total_count);
    });
  }
}
