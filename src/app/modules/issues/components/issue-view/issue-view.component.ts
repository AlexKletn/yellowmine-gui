import { Component, inject, Input, ViewChild } from '@angular/core';
import IssuesService from '../../issues-service/issues.service';
import Issue from '../../domain/Issue';
import { DatePipe, JsonPipe, NgIf } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { Title } from '@angular/platform-browser';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { TimeEntryFormComponent } from '../../../time-entries/components/time-entry-form/time-entry-form.component';
import { DialogModule } from 'primeng/dialog';
import { Select } from '@ngxs/store';
import RedmineConfigState from '../../../../core/services/redmine-config/store/redmine-config.state';
import { Observable } from 'rxjs';

type Argument = {
  label: string;
  value: string | number;
};

@Component({
  selector: 'rm-issue-view',
  standalone: true,
  imports: [
    JsonPipe,
    PanelModule,
    TagModule,
    NgIf,
    CardModule,
    DividerModule,
    TableModule,
    DatePipe,
    ProgressSpinnerModule,
    ProgressBarModule,
    ButtonModule,
    TimeEntryFormComponent,
    DialogModule,
  ],
  templateUrl: './issue-view.component.html',
  styleUrl: './issue-view.component.scss',
})
export class IssueViewComponent {
  @ViewChild('createForm') createForm!: TimeEntryFormComponent;

  @Select(RedmineConfigState.redmineUrl)
  private redmineUrl$!: Observable<string>;

  private titleService = inject(Title);
  private redmineUrl?: string;

  @Input() id!: number;
  issue?: Issue;

  description?: string;

  issueArguments: Array<Argument> = [];

  isLoading: boolean = false;

  constructor(private issuesService: IssuesService) {
    this.titleService.setTitle('Задача...');

    this.redmineUrl$.subscribe((url) => {
      this.redmineUrl = url;
    });
  }

  ngOnInit() {
    if (this.id) {
      this.loadIssue();
    }
  }

  ngOnChanges() {
    if (this.id) {
      this.loadIssue();
    }
  }

  openInRedmine() {
    console.log(`${this.redmineUrl}/issues/${this.id}`);
    window.open(`${this.redmineUrl}/issues/${this.id}`, '_blank');
  }

  openTimeEntryForm() {
    this.createForm.updateFormData({
      issue: this.issue,
    });
  }

  private loadIssue() {
    this.isLoading = true;

    this.issuesService.getIssue(this.id).subscribe({
      next: ({ issue }) => {
        this.issue = issue;
        this.fillArguments();

        this.description = this.issuesService.parseDescription(issue.description);

        this.titleService.setTitle(`Задача: ${issue.id} - ${issue.subject}`);
        this.isLoading = false;
      },
    });
  }

  private fillArguments() {
    if (this.issue) {
      const issueArgs: Argument[] = [
        {
          label: 'Статус',
          value: this.issue.status.name ?? '',
        },
        {
          label: 'Приоритет',
          value: this.issue.priority.name ?? '',
        },
        {
          label: 'Назначена',
          value: this.issue.assigned_to?.name ?? '-',
        },
        {
          label: 'Дата начала',
          value: this.issue.start_date,
        },
        {
          label: 'Оценка времени',
          value: this.issue.total_estimated_hours,
        },
        {
          label: 'Затрачено',
          value: this.issue.total_spent_hours,
        },
        {
          label: 'Готовность',
          value: this.issue.done_ratio,
        },
        {
          label: 'Готовность',
          value: this.issue.done_ratio,
        },
      ];

      this.issue.custom_fields?.forEach((field) => {
        if (field.value) {
          issueArgs.push({
            label: field.name,
            value: field.value!,
          });
        }
      });

      this.issueArguments = issueArgs;
    }
  }
}
