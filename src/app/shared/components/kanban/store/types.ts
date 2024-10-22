import { BaseModel } from '@shared/api/redmine-api/types';

export interface KanbanStoreState {
  currentItem?: BaseModel;
}
