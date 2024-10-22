import { Attachment } from '@entities/attachment/types';
import { BaseModel, DefinitionRecord } from '@shared/api/redmine-api/types';

export type IssueJournal = BaseModel & {
  notes: string;
  user: DefinitionRecord;
  // details: string;
};

export default interface Issue extends BaseModel {
  subject: string;
  description: string;

  project: DefinitionRecord;
  status: DefinitionRecord;
  priority: DefinitionRecord;
  author: DefinitionRecord;
  assigned_to?: DefinitionRecord;
  tracker: DefinitionRecord;
  attachments: Attachment[];
  journals: IssueJournal[];

  estimated_hours: number;
  total_estimated_hours: number;
  total_spent_hours: number;
  done_ratio: number;

  start_date: string;
  close_on: string;

  custom_fields: Array<DefinitionRecord>;
}
