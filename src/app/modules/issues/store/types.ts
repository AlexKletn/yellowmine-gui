import { IssueStatus } from '../../issue-statuses/domain/IssueStatus';

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
      };
    };
  };
}
