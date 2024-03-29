import { BaseModel } from '../../../../../core/services/redmine-api/types';

export class SetCurrentItem {
  static readonly type = '[Kanban] Set Current Item';

  constructor(public item?: BaseModel) {
  }
}
