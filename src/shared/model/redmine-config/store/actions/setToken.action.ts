export class SetTokenAction {
  static readonly type = '[Redmine] Set Token';

  constructor(public token?: string) {
  }
}
