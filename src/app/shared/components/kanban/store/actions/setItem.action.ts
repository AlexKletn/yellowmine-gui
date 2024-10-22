import { BaseModel } from '@shared/api/redmine-api/types';

export class SetCurrentItem {
  static readonly type = '[Kanban] Set Current Item';

  constructor(public item?: BaseModel) {
  }
}
