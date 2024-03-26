import { DefinitionRecord } from '../../../core/services/redmine-api/types';

export interface Tracker {
  id: number;
  name: string;
  default_status: DefinitionRecord;
}
