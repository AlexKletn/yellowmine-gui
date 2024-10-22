import { DefinitionRecord } from '@shared/api/redmine-api/types';

export interface Tracker {
  id: number;
  name: string;
  default_status: DefinitionRecord;
}
