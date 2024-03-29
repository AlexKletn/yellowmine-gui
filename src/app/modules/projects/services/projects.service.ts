import { Injectable } from '@angular/core';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import Project from '../domain/Project';
import { ProjectsResponse } from './types';
import { SetActiveProject, SetProjects } from '../store/projects.actions';

@Injectable({ providedIn: 'root' })
class ProjectsService {
  projects: Observable<Project[]>;
  activeProject: Observable<Project>;

  constructor(private redmineApi: RedmineApiService, private store: Store) {
    this.projects = store.select(({ projects }) => {
      return projects.items;
    });

    this.activeProject = store.select(({ projects }) => {
      return projects.items.find(({ id }: Project) => id == projects.activeProject);
    });

    this.loadProjects();
  }

  loadProjects() {
    this.redmineApi.get<ProjectsResponse>('/api/projects.json').subscribe(({ projects }) => {
      this.store.dispatch(new SetProjects(projects));
    });
  }

  setActiveProject(id: Project['id']) {
    return this.store.dispatch(new SetActiveProject(id));
  }
}

export default ProjectsService;
