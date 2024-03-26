import { ProjectsStoreState } from '../types';

export class SetActiveProject {
  static readonly type = '[Projects] set active project';

  constructor(public activeProject: ProjectsStoreState['activeProject']) {
  }
}
