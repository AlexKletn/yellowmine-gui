import { BaseModel, DefinitionRecord } from '../../../core/services/redmine-api/types';

export interface KanbanItem extends BaseModel {
  id: number;
}

export interface KanbanColumn extends DefinitionRecord {
}
