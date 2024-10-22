import { BaseModel } from '@shared/api/redmine-api/types';

export default interface Project extends BaseModel {
  name: string;
  identifier: string;
  description: string;
  status: number;
  parent: number;
  created_on: string;
  updated_on: string;

  custom_fields: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}
