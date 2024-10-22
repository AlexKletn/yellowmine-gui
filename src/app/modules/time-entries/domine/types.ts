import { DefinitionRecord } from '@shared/api/redmine-api/types';

import Issue from '../../issues/domain/Issue';
import Project from '../../projects/domain/Project';

export interface TimeEntry {
  id: number;
  issue: Issue;
  comments: string;
  hours: number;
  project: Pick<Project, 'id' | 'name'>;
  spent_on: string;
  user: DefinitionRecord;
  created_on: string;
  updated_on: string;
}
