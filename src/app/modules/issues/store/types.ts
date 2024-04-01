import { IssueStatus } from '../../issue-statuses/domain/IssueStatus';
import { Membership } from '../../projects/domain/Membership';

export interface IssuesStoreState {
  settings: {
    kanban: {
      activeIssueStatuses: Array<IssueStatus>;
    };

    kanbanFilters: {
      model: {
        tag?: string;
        subject?: string;
        isMy?: boolean;
        assignedTo?: Array<Membership['user']['id']>;
      };
    };
  };
}
