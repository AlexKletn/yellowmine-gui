import { AppConfig } from '@shared/model/app-config/store/types';

export class SetSchemeAction {
  static readonly type = '[App] Set scheme';

  constructor(public scheme: AppConfig['scheme']) {
  }
}
