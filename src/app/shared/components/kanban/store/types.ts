import { BaseModel } from '../../../../core/services/redmine-api/types';

export interface KanbanStoreState {
  currentItem?: BaseModel;
}
