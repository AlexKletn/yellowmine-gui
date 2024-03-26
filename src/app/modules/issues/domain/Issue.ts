import { BaseModel, DefinitionRecord } from '../../../core/services/redmine-api/types';

export default interface Issue extends BaseModel {
  subject: string;
  description: string;

  project: DefinitionRecord;
  status: DefinitionRecord;
  priority: DefinitionRecord;
  author: DefinitionRecord;
  assigned_to?: DefinitionRecord;
  tracker: DefinitionRecord;

  estimated_hours: number;
  total_estimated_hours: number;
  total_spent_hours: number;
  done_ratio: number;

  start_date: string;
  close_on: string;

  custom_fields: Array<DefinitionRecord>;
}
