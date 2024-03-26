import { ProjectsStoreState } from '../types';

export class SetTags {
  static readonly type = '[Projects] set tags';

  constructor(public tags: ProjectsStoreState['tags']) {
  }
}
