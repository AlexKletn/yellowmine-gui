import { TimeEntry } from '../domine/types';

export interface TimeEntryResponse {
  time_entries: TimeEntry[];
}

export interface CreateTimeEntryRequest extends Pick<TimeEntry, 'spent_on' | 'hours' | 'comments'> {
  issue_id: number;
}

export interface UpdateTimeEntryRequest extends Partial<CreateTimeEntryRequest> {
  id: number;
}
