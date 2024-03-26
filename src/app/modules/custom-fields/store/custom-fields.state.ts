import { CustomFieldsStore } from './types';
import { Action, State, StateContext } from '@ngxs/store';
import { SetCustomFields } from './actions/SetCustomFields';

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
