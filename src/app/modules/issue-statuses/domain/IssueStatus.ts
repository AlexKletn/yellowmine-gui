import { DefinitionRecord } from '../../../core/services/redmine-api/types';

export interface IssueStatus extends DefinitionRecord {
  is_closed?: boolean;
}
