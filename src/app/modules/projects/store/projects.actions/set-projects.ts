import { ProjectsStoreState } from '../types';

export class SetProjects {
  static readonly type = '[Projects] set projects';

  constructor(public items: ProjectsStoreState['items']) {
  }
}
