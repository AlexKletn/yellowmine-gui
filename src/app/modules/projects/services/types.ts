import Project from '../domain/Project';
import { BaseResponse } from '../../../core/services/redmine-api/types';
import { Membership } from '../domain/Membership';

export interface ProjectsResponse extends BaseResponse {
  projects: Project[];
}

export interface ProjectMembershipsResponse extends BaseResponse {
  memberships: Membership[];
}

export type ProjectTagsResponse = string[];
