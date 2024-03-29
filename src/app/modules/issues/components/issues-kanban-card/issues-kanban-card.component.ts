import { Component, Input } from '@angular/core';
import Issue from '../../domain/Issue';
import { NgIf } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from 'primeng/api';
import { IssuesKanbanCardContextComponent } from '../issues-kanban-card-context/issues-kanban-card-context.component';
import { TagModule } from 'primeng/tag';

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
  ],
  templateUrl: './issues-kanban-card.component.html',
  styleUrl: './issues-kanban-card.component.scss',
})
export class IssuesKanbanCardComponent {
  @Input() issue!: Issue;
  @Input() loading!: boolean;
}
