// import ProjectsState from './modules/projects/store/projects.state';
// import TrackersState from './modules/trackers/store/trackers.state';
// import IssueStatusesState from './modules/issue-statuses/store/issueStatuses.state';
// import IssuesState from './modules/issues/store/issues.state';
// import RedmineConfigState from './core/services/redmine-config/store/redmine-config.state';
// import ApplicationState from './core/store/application-store/application.state';
// import KanbanState from './shared/components/kanban/store/Kanban.state';

import { AppConfigState } from '@shared/model/app-config';
import { RedmineConfigState } from '@shared/model/redmine-config';

export default [
  AppConfigState,
  RedmineConfigState,
  // TrackersState,
  // IssueStatusesState,
  // IssuesState,
  // RedmineConfigState,
  // ApplicationState,
  // KanbanState,
];
