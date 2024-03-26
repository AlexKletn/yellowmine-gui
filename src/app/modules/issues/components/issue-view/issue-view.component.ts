import { Component, Input } from '@angular/core';
import IssuesService from '../../issues-service/issues.service';
import Issue from '../../domain/Issue';
import { DatePipe, JsonPipe, NgIf } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

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
  ],
  templateUrl: './issue-view.component.html',
  styleUrl: './issue-view.component.scss',
})
export class IssueViewComponent {
  @Input() id!: number;
  issue?: Issue;

  description?: string;

  issueArguments: Array<Argument> = [];

  constructor(private issuesService: IssuesService) {
  }

  ngOnInit() {
    this.issuesService.getIssue(this.id).subscribe({
      next: ({ issue }) => {
        this.issue = issue;
        this.fillArguments();

        this.description = this.issuesService.parseDescription(issue.description);
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
