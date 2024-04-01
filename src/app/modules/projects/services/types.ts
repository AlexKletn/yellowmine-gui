import Project from '../domain/Project';
import { BaseResponse } from '../../../core/services/redmine-api/types';

export interface ProjectsResponse extends BaseResponse {
  projects: Project[];
}

export type ProjectTagsResponse = string[];
