import { Tracker } from '../../domain/types';

class SetTrackers {
  static type = '[Trackers] Set Trackers';

  constructor(public trackers: Tracker[]) {
  }
}

export default SetTrackers;
