import { inject, Injectable } from '@angular/core';
import RedmineApiService from '../../../core/services/redmine-api/redmine-api.service';
import { RequestFilterMaker } from '../../../core/services/redmine-api/Pagination.request';
import { CreateTimeEntryRequest, TimeEntryResponse, UpdateTimeEntryRequest } from './types';

@Injectable()
export default class TimeEntriesService {
  private redmineApiService = inject(RedmineApiService);

  loadTimeEntries(filter: RequestFilterMaker) {
    return this.redmineApiService.get<TimeEntryResponse>('api/time_entries.json', {
      params: filter?.make() ?? undefined,
    });
  }

  createTimeEntry(timeEntry: CreateTimeEntryRequest) {
    return this.redmineApiService.post<TimeEntryResponse>('api/time_entries.json', {
      time_entry: timeEntry,
    });
  }

  updateTimeEntry(timeEntry: UpdateTimeEntryRequest) {
    return this.redmineApiService.put<TimeEntryResponse>(`api/time_entries/${timeEntry.id}.json`, {
      time_entry: timeEntry,
    });
  }
}
