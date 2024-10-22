import { BaseResponse } from '@shared/api/redmine-api/types';

import { Membership } from '../domain/Membership';
import Project from '../domain/Project';

export interface ProjectsResponse extends BaseResponse {
  projects: Project[];
}

export interface ProjectMembershipsResponse extends BaseResponse {
  memberships: Membership[];
}

export type ProjectTagsResponse = string[];
