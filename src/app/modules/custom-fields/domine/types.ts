import { BaseModel } from '../../../core/services/redmine-api/types';

export interface CustomField<Type = unknown> extends Pick<BaseModel, 'id'> {
  name: string;
  customized_type: string;
  field_format: string;

  regex: string;
  min_length: number;
  max_length: number;
  is_required: boolean;

  is_filter: boolean;
  searchable: boolean;
  multiple: boolean;
  visible: boolean;

  default_value: Type;

  possible_values: Array<{
    value: Type;
  }>;
}
