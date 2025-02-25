import Issue from '../domain/Issue';
import { BaseResponse, DefinitionRecord } from '../../../core/services/redmine-api/types';

export interface IssuesResponse extends BaseResponse {
  issues: Issue[];
}

export interface IssueResponse {
  issue: Issue;
}

export interface IssueCreateRequest extends Omit<Issue, 'status' | 'priority' | 'author' | 'assigned_to' | 'tracker' | 'id' | 'project'> {
  project_id: DefinitionRecord['id'];
  tracker_id: DefinitionRecord['id'];
  status_id: DefinitionRecord['id'];
  priority_id: DefinitionRecord['id'];
  assigned_to_id: DefinitionRecord['id'];
}

export type IssueUpdateRequest = Partial<IssueCreateRequest> & { id: Issue['id'] };
