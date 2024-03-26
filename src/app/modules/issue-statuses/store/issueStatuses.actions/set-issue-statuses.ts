import { IssueStatusesStoreState } from '../types';

export class SetIssueStatuses {
  static readonly type = '[IssueStatuses] set IssueStatuses';

  constructor(public items: IssueStatusesStoreState['items']) {
  }
}
