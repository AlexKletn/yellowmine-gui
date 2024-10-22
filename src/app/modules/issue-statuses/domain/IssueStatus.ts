import { DefinitionRecord } from '@shared/api/redmine-api/types';

export interface IssueStatus extends DefinitionRecord {
  is_closed?: boolean;
}
