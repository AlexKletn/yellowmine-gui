import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

import Issue from '../../domain/Issue';
import { IssuesKanbanCardContextComponent } from '../issues-kanban-card-context/issues-kanban-card-context.component';

@Component({
  selector: 'rm-issues-kanban-card',
  standalone: true,
  imports: [
    NgIf,
    ProgressBarModule,
    ProgressSpinnerModule,
    SharedModule,
    IssuesKanbanCardContextComponent,
    TagModule,
    DialogModule,
  ],
  templateUrl: './issues-kanban-card.component.html',
  styleUrl: './issues-kanban-card.component.scss',
})
export class IssuesKanbanCardComponent {
  @Input() issue!: Issue;
  @Input() loading!: boolean;
}
