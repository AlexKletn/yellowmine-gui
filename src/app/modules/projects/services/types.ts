import Project from '../domain/Project';

export interface ProjectsResponse {
  projects: Project[];
}

export type ProjectTagsResponse = string[];
