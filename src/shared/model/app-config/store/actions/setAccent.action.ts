export class SetAccentAction {
  static readonly type = '[App] Set accent';

  constructor(public accent: `#${string}`) {
  }
}
