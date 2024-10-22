import { BaseModel, DefinitionRecord } from '@shared/api/redmine-api/types';

export type Attachment = BaseModel & {
  author: DefinitionRecord;
  content_type: string;
  content_url: string;
  created_on: string;
  description: string;
  filename: string;
  filesize: number;
};
