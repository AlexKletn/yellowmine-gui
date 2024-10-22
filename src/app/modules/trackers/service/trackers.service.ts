import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import RedmineApiService from '@shared/api/redmine-api/redmine-api.service';

import { Tracker } from '../domain/types';
import SetTrackers from '../store/actions/setTrackers';

import { TrackersResponse } from './types';

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
