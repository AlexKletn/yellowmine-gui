import { IssuesStoreState } from '../types';

export class SetSettingsKanban {
  static readonly type = '[SettingsKanban] set SettingsKanban';

  constructor(public settingsKanban: IssuesStoreState['settings']['kanban']) {
  }
}
