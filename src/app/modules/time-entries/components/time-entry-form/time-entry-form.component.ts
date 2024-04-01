import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownFilterEvent, DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { NgClass } from '@angular/common';
import dayjs from 'dayjs';
import { RequestFilterMaker } from '../../../../core/services/redmine-api/Pagination.request';
import Issue from '../../../issues/domain/Issue';
import TimeEntriesService from '../../service/timeEntries.service';
import IssuesService from '../../../issues/issues-service/issues.service';
import { CreateTimeEntryRequest } from '../../service/types';
import { TooltipModule } from 'primeng/tooltip';
import { TimeEntry } from '../../domine/types';

@Component({
  selector: 'rm-time-entry-form',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextareaModule,
    PaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    TagModule,
    NgClass,
    TooltipModule,
  ],
  providers: [TimeEntriesService, IssuesService],
  templateUrl: './time-entry-form.component.html',
  styleUrl: './time-entry-form.component.scss',
})
export class TimeEntryFormComponent {
  private timeEntriesService = inject(TimeEntriesService);
  private issuesService = inject(IssuesService);

  @Output() onChange = new EventEmitter();

  timeEntreForm = new FormGroup({
    id: new FormControl<number>(0),
    date: new FormControl(dayjs().format('DD.MM.YYYY'), {
      validators: [Validators.required],
    }),
    issueId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    hours: new FormControl(0, {
      validators: [Validators.required],
    }),
    comment: new FormControl<string>(''),
  });

  isOpenedTimeEntryDialog: boolean = false;
  isCreateTimeEntryLoading: boolean = false;
  isLoadingIssues: boolean = true;

  private issuesFilter: RequestFilterMaker = new RequestFilterMaker(0, 10);
  issues: Issue[] = [];

  updateFormData(entry: Partial<TimeEntry>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newFormValue: any = {};

    if (entry.id) {
      newFormValue.id = entry.id;
    }
    if (entry.spent_on) {
      newFormValue.date = entry.spent_on;
    }
    if (entry.hours) {
      newFormValue.hours = entry.hours;
    }
    if (entry.comments) {
      newFormValue.comment = entry.comments;
    }
    if (entry.issue) {
      newFormValue.issueId = entry.issue.id;
    }

    this.timeEntreForm.patchValue(newFormValue);

    this.openTimeEntryDialog();
  }

  setFormData(entry: Partial<TimeEntry>) {
    this.timeEntreForm.reset({
      id: entry.id,
      date: dayjs(entry.spent_on, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      hours: entry.hours,
      comment: entry.comments,
      issueId: entry.issue?.id,
    });

    if (entry.issue) {
      this.issuesService.getIssue(entry.issue.id).subscribe(({ issue }) => {
        this.issues = [...this.issues, issue];
        this.openTimeEntryDialog();
      });
    }
    else {
      this.openTimeEntryDialog();
    }
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
          this.onChange.emit();
          this.closeTimeEntryDialog();
        });
      }
      else {
        this.timeEntriesService.createTimeEntry(timeEntry).subscribe(
          () => {
            this.isCreateTimeEntryLoading = false;
            this.onChange.emit();
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
}
