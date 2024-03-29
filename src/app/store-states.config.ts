import ProjectsState from './modules/projects/store/projects.state';
import TrackersState from './modules/trackers/store/trackers.state';
import IssueStatusesState from './modules/issue-statuses/store/issueStatuses.state';
import IssuesState from './modules/issues/store/issues.state';
import RedmineConfigState from './core/services/redmine-config/store/redmine-config.state';
import ApplicationState from './core/store/application-store/application.state';

export default [
  ProjectsState,
  TrackersState,
  IssueStatusesState,
  IssuesState,
  RedmineConfigState,
  ApplicationState,
];
