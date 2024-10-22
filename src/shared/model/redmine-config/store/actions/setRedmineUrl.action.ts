export class SetRedmineUrlAction {
  static readonly type = '[Redmine] Set Redmine Url';

  constructor(public redmineUrl: string) {
  }
}
