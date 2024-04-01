import { Membership } from '../../domain/Membership';

export class SetMembershipsAction {
  static readonly type = '[Redmine] Set Memberships';

  constructor(public memberships: Membership[]) {
  }
}
