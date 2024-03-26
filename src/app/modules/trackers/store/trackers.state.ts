import { Action, State, StateContext } from '@ngxs/store';
import { TrackersStoreState } from './types';
import SetTrackers from './actions/setTrackers';
import { Injectable } from '@angular/core';

type TrackersStore = StateContext<TrackersStoreState>;

@State<TrackersStoreState>({
  name: 'trackers',
  defaults: {
    items: [],
  },
})
@Injectable()
class TrackersState {
  @Action(SetTrackers)
  setTrackers(ctx: TrackersStore, action: SetTrackers) {
    ctx.setState({
      items: action.trackers,
    });
  }
}

export default TrackersState;
