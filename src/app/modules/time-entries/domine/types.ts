import Issue from '../../issues/domain/Issue';
import { DefinitionRecord } from '../../../core/services/redmine-api/types';
import Project from '../../projects/domain/Project';

export interface TimeEntry {
  id: number;
  issue: Pick<Issue, 'id'>;
  comments: string;
  hours: number;
  project: Pick<Project, 'id' | 'name'>;
  spent_on: string;
  user: DefinitionRecord;
  created_on: string;
  updated_on: string;
}
