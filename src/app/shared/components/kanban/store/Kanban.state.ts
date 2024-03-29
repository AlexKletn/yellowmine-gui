import { Action, Selector, State, StateContext } from '@ngxs/store';
import { KanbanStoreState } from './types';
import { SetCurrentItem } from './actions/setItem.action';

type KanbanStore = StateContext<KanbanStoreState>;

@State<KanbanStoreState>({
  name: 'kanban',
  defaults: {
    currentItem: undefined,
  },
})
export default class KanbanState {
  @Selector()
  static currentItem(state: KanbanStoreState) {
    return state.currentItem;
  }

  @Action(SetCurrentItem)
  setKanbanItem(ctx: KanbanStore, { item }: SetCurrentItem) {
    ctx.setState({
      currentItem: item,
    });
  }
}
