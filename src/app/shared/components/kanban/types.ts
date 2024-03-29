import { BaseModel, DefinitionRecord } from '../../../core/services/redmine-api/types';

export interface KanbanItem<Item extends BaseModel, Additional> {
  item: Item;
  additional: Additional;
}

export interface KanbanColumn extends DefinitionRecord {
}
