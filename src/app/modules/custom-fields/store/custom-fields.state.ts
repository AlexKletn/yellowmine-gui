import { Action, State, StateContext } from '@ngxs/store';

import { SetCustomFields } from './actions/SetCustomFields';
import { CustomFieldsStore } from './types';

type CustomFieldsContext = StateContext<CustomFieldsStore>;

@State<CustomFieldsStore>({
  name: 'customFields',
  defaults: {
    fields: [],
  },
})
class CustomFieldsState {
  @Action(SetCustomFields)
  setFields(ctx: CustomFieldsContext, action: SetCustomFields) {
    ctx.setState({
      fields: action.fields,
    });
  }
}

export default CustomFieldsState;
