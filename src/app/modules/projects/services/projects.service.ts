import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, combineLatestWith, Observable, Subject } from 'rxjs';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';
import { RequestFilterMaker } from '@shared/api/redmine-api/RequestFilter';
import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

import Project from '../domain/Project';
import { SetActiveProject, SetProjects } from '../store/projects.actions';

import { ProjectsResponse } from './types';

const LIMIT = 100;

@Injectable({ providedIn: 'root' })
class ProjectsService {
  private projectsFilter: RequestFilterMaker = new RequestFilterMaker(0, LIMIT);

  @Select(RedmineConfigState.apiKey)
  private redmineApiKey$!: Observable<string>;

  totalCount: Subject<number> = new Subject();
  projects: Observable<Project[]>;
  activeProject: Observable<Project>;

  constructor(private redmineApi: RedmineApiService, private store: Store) {
    this.projectsFilter.setFilter('set_filter', '1');

    this.projects = store.select(({ projects }) => {
      return projects.items;
    });

    this.activeProject = store.select(({ projects }) => {
      return projects.items.find(({ id }: Project) => id == projects.activeProject);
    });

    this.redmineApiKey$.subscribe((key) => {
      if (key) {
        this.getTotalCount();
      }
    });

    this.totalCount.pipe(
      combineLatestWith(this.redmineApiKey$),
    ).subscribe(([count, key]) => {
      if (key) {
        this.loadProjects(count);
      }
    });
  }

  get filter() {
    return this.projectsFilter;
  }

  loadProjects(totalCount: number) {
    const pages = totalCount / LIMIT;

    const requests = [];

    for (let i = 0; i < pages; i++) {
      this.projectsFilter.setOffsetPagination(i * LIMIT, LIMIT);
      const request = this.loadProjectsPage(this.projectsFilter.make());

      requests.push(request);
    }

    (combineLatest(requests)).subscribe((res) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const projects = res.reduce((acc, proj) => ([...acc, ...proj.projects]), [] as Project[]);
      this.store.dispatch(new SetProjects(projects));
    });
  }

  setActiveProject(id: Project['id']) {
    return this.store.dispatch(new SetActiveProject(id));
  }

  private getTotalCount() {
    this.redmineApi.get<ProjectsResponse>('/api/projects.json', {
      params: this.projectsFilter.make(),
    }).subscribe(({ total_count }) => {
      this.totalCount.next(total_count);
    });
  }

  private loadProjectsPage(filters: Record<string, unknown>) {
    return this.redmineApi.get<ProjectsResponse>('/api/projects.json', {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params: filters,
    });
  }
}

export default ProjectsService;
