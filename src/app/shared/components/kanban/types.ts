import { BaseModel, DefinitionRecord } from '@shared/api/redmine-api/types';

export interface KanbanItem<Item extends BaseModel, Additional> {
  item: Item;
  additional: Additional;
}

export interface KanbanColumn extends DefinitionRecord {
}
