import { Component, inject, ViewChild } from '@angular/core';
import TimeEntriesService from '../../service/timeEntries.service';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { RequestFilterMaker } from '../../../../core/services/redmine-api/Pagination.request';
import { JsonPipe, NgClass } from '@angular/common';
import dayjs from 'dayjs';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';
import _ from 'lodash';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownFilterEvent, DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import IssuesService from '../../../issues/issues-service/issues.service';
import Issue from '../../../issues/domain/Issue';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CreateTimeEntryRequest, UpdateTimeEntryRequest } from '../../service/types';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.locale('ru');

@Component({
  selector: 'rm-time-entries-page',
  standalone: true,
  imports: [
    CalendarModule,
    CardModule,
    FullCalendarModule,
    JsonPipe,
    PanelModule,
    TagModule,
    BadgeModule,
    BottomPanelComponent,
    DialogModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    FloatLabelModule,
    ReactiveFormsModule,
    TooltipModule,
    NgClass,
  ],
  templateUrl: './time-entries-page.component.html',
  styleUrl: './time-entries-page.component.scss',
  providers: [TimeEntriesService],
})
export class TimeEntriesPageComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private timeEntriesService = inject(TimeEntriesService);
  private issuesService = inject(IssuesService);

  private filter: RequestFilterMaker = new RequestFilterMaker(0, 100);

  private issuesFilter: RequestFilterMaker = new RequestFilterMaker(0, 10);
  issues: Issue[] = [];

  timeEntreForm = new FormGroup({
    id: new FormControl<number>(0),
    date: new FormControl(dayjs().format('DD.MM.YYYY'), {
      validators: [Validators.required],
    }),
    issueId: new FormControl(null, {
      validators: [Validators.required],
    }),
    hours: new FormControl(0, {
      validators: [Validators.required],
    }),
    comment: new FormControl(null),
  });

  currentMonthName: string = '...';
  nextMonthName: string = '...';
  prevMonthName: string = '...';

  isNextDisabled: boolean = false;
  isLoading: boolean = true;
  isLoadingIssues: boolean = true;

  isOpenedTimeEntryDialog: boolean = false;
  isCreateTimeEntryLoading: boolean = false;

  ngAfterViewInit() {
    this.isNextDisabled = true;

    this.updateMountNames();
    this.updateTimeEntries();
    this.dateCheck();
    this.loadIssues({ filter: '' });
  }

  calendarOptions: CalendarOptions = {
    // initialView: 'dayGridMonth',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: arg => this.handleDateClick(arg),
    allDayText: 'fsda',
    editable: true,
    selectable: true,
    dayCount: 342,
    events: [],
    firstDay: 1,
    locale: 'ru',
    headerToolbar: false,
    height: 'auto',
    eventDurationEditable: false,
    eventDrop: arg => this.dropHandler(arg),
    eventClick: arg => this.handleEventClick(arg),
    expandRows: true,
  };

  handleDateClick({ date }: DateClickArg) {
    if (!this.isOpenedTimeEntryDialog) {
      this.timeEntreForm.reset({
        date: dayjs(date).format('DD.MM.YYYY'),
        hours: 1,
      });
    }
    else {
      this.timeEntreForm.patchValue({
        date: dayjs(date).format('DD.MM.YYYY'),
      });
    }

    this.openTimeEntryDialog();
  }

  handleEventClick({ event }: EventClickArg) {
    const { extendedProps } = event.toPlainObject();

    this.timeEntreForm.reset({
      id: extendedProps.id,
      date: dayjs(extendedProps.spent_on, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      hours: extendedProps.hours,
      comment: extendedProps.comments,
      issueId: extendedProps.issue.id,
    });

    this.issuesService.getIssue(extendedProps.issue.id).subscribe(({ issue }) => {
      this.issues = [...this.issues, issue];
      this.openTimeEntryDialog();
    });
  }

  dropHandler({ event }: EventDropArg) {
    const { start, extendedProps } = event.toPlainObject();

    const timeEntry: UpdateTimeEntryRequest = {
      id: extendedProps.id,
      spent_on: dayjs(start).format('YYYY-MM-DD'),
    };

    this.timeEntriesService.updateTimeEntry(timeEntry).subscribe(() => {
      // this.updateTimeEntries();
    });
  }

  getFullHoursCountByDate(date: Date) {
    const events = this.calendarOptions.events as Array<{ date: Date; extendedProps: { hours: number } }>;
    const dayEvents = events.filter(({ date: eventDate }) => {
      return dayjs(eventDate).isSame(date, 'day');
    });

    return (dayEvents.reduce((acc, { extendedProps }) => acc + extendedProps.hours, 0));
  }

  nextMonth() {
    this.calendarComponent.getApi().next();
    this.updateTimeEntries();
    this.updateMountNames();
    this.dateCheck();
  }

  prevMonth() {
    this.calendarComponent.getApi().prev();
    this.updateTimeEntries();
    this.updateMountNames();
    this.dateCheck();
  }

  updateTimeEntries() {
    this.isLoading = true;
    this.updateFilter();

    this.timeEntriesService.loadTimeEntries(this.filter).subscribe(
      ({ time_entries }) => {
        this.calendarOptions.events = time_entries.map(({ spent_on, comments, id, issue, hours }) => {
          this.isLoading = false;

          return ({ date: spent_on, title: comments, extendedProps: {
            spent_on,
            comments,
            issue,
            hours,
            id,
          } });
        });
      },
    );
  }

  sendTimeEntry() {
    if (this.timeEntreForm.valid) {
      this.isCreateTimeEntryLoading = true;

      const { date, issueId, comment, hours, id } = this.timeEntreForm.value;

      const timeEntry: CreateTimeEntryRequest = {
        spent_on: dayjs(date, 'DD.MM.YYYY').format('YYYY-MM-DD')!,
        issue_id: issueId!,
        comments: comment!,
        hours: hours ?? 0,
      };

      if (id) {
        this.timeEntriesService.updateTimeEntry({
          ...timeEntry,
          id,
        }).subscribe(() => {
          this.isCreateTimeEntryLoading = false;
          this.updateTimeEntries();
          this.closeTimeEntryDialog();
        });
      }
      else {
        this.timeEntriesService.createTimeEntry(timeEntry).subscribe(
          () => {
            this.isCreateTimeEntryLoading = false;
            this.updateTimeEntries();
            this.closeTimeEntryDialog();
          },
        );
      }
    }
  }

  loadIssues({ filter }: Partial<Pick<DropdownFilterEvent, 'filter'>> = {}) {
    this.isLoadingIssues = true;
    if (filter) {
      this.issuesFilter.setFilter('subject', `~${filter}`);
    }

    this.issuesService.getIssues(this.issuesFilter).subscribe(
      ({ issues }) => {
        this.issues = issues;
        this.isLoadingIssues = false;
      },
    );
  }

  openTimeEntryDialog() {
    this.isOpenedTimeEntryDialog = true;
  }

  closeTimeEntryDialog() {
    this.isOpenedTimeEntryDialog = false;
  }

  private updateFilter() {
    const date = dayjs(this.calendarComponent.getApi().getDate());

    this.filter.setFilter('user_id', 'me');
    this.filter.setFilter('from', date.startOf('month').format('YYYY-MM-DD'));
    this.filter.setFilter('to', date.endOf('month').format('YYYY-MM-DD'));
  }

  private updateMountNames() {
    const date = this.calendarComponent.getApi().getDate();

    const mountName = dayjs(date).format('MMMM (YYYY)');
    const nextMountName = dayjs(date).add(1, 'M').format('MMMM (YYYY)');
    const prevMountName = dayjs(date).subtract(1, 'M').format('MMMM (YYYY)');

    this.currentMonthName = _.capitalize(mountName);
    this.nextMonthName = _.capitalize(nextMountName);
    this.prevMonthName = _.capitalize(prevMountName);
  }

  private dateCheck() {
    const date = this.calendarComponent.getApi().getDate();

    this.isNextDisabled = dayjs(date).diff(dayjs(), 'month') === 0;
  }
}
