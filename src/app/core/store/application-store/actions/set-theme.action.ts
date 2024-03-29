export default class SetThemeAction {
  static type = '[Application] Set Theme';

  constructor(public theme: string) {
  }
}
