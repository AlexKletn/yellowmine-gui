import { Component, inject, Input } from '@angular/core';
import Issue from '../../domain/Issue';
import IssuesService from '../../issues-service/issues.service';
import { InplaceModule } from 'primeng/inplace';
import { SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'rm-issue-kanban-card-info',
  standalone: true,
  imports: [
    InplaceModule,
    SharedModule,
    InputTextModule,
    ProgressSpinnerModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './issue-kanban-card-info.component.html',
  styleUrl: './issue-kanban-card-info.component.scss',
})
export class IssueKanbanCardInfoComponent {
  @Input() issue!: Issue;

  private issuesService: IssuesService = inject(IssuesService);

  loading: boolean = false;
  issueDetails!: Issue;

  description?: string;

  constructor() {
  }

  loadIssueDetails() {
    this.loading = true;

    this.issuesService.getIssue(this.issue.id).subscribe(({ issue }) => {
      this.issueDetails = issue;

      if (issue.description) {
        this.description = this.issuesService.parseDescription(issue.description);
      }
      this.loading = false;
    });
  }
}
