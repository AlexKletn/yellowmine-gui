import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { Observable } from 'rxjs';
import { Tracker } from '../domain/types';
import { TrackersResponse } from './types';
import SetTrackers from '../store/actions/setTrackers';

@Injectable({ providedIn: 'root' })
class TrackerService {
  trackers: Observable<Tracker[]>;

  constructor(private store: Store, private redmineApi: RedmineApiService) {
    this.trackers = this.store.select(({ trackers }) => {
      return trackers.items;
    });
  }

  loadTrackers() {
    this.redmineApi.get<TrackersResponse>('api/trackers.json').subscribe(({ trackers }) => {
      this.store.dispatch(new SetTrackers(trackers));
    });
  }
}

export default TrackerService;
