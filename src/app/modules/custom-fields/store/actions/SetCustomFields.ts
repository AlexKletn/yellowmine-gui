import { CustomField } from '../../domine/types';

export class SetCustomFields {
  static type: string = '[CustomFields] Set Custom Fields';

  constructor(public fields: CustomField[]) {
  }
}
