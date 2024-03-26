import { Injectable } from '@angular/core';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import Project from '../domain/Project';
import { ProjectsResponse, ProjectTagsResponse } from './types';
import { SetActiveProject, SetProjects } from '../store/projects.actions';
import { SetTags } from '../store/projects.actions/set-tags';

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
    this.loadProjectTags();
  }

  loadProjects() {
    this.redmineApi.get<ProjectsResponse>('/api/projects.json').subscribe(({ projects }) => {
      this.store.dispatch(new SetProjects(projects));
    });
  }

  setActiveProject(id: Project['id']) {
    return this.store.dispatch(new SetActiveProject(id));
  }

  loadProjectTags() {
    this.activeProject.subscribe((activeProject) => {
      if (activeProject) {
        this.redmineApi.get<ProjectTagsResponse>(`api/issue_tags/auto_complete/${activeProject.id}`, {
          params: {
            q: 'Спринт',
          },
          headers: {
            Accept: 'application/json',
          },
        }).subscribe((tags) => {
          this.store.dispatch(new SetTags(tags));
        });
      }
    });
  }
}

export default ProjectsService;
