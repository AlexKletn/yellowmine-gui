import Project from '../domain/Project';

export interface ProjectsStoreState {
  items: Array<Project>;
  tags: Array<string>;
  activeProject?: Project['id'];
}
