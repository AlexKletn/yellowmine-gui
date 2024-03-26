import { Component, Input } from '@angular/core';
import { ContextMenuComponent } from '../../../../shared/components/context-menu/context-menu.component';
import Issue from '../../domain/Issue';
import { InplaceModule } from 'primeng/inplace';
import { IssueKanbanCardInfoComponent } from '../issue-kanban-card-info/issue-kanban-card-info.component';

@Component({
  selector: 'rm-issues-kanban-card-context',
  standalone: true,
  imports: [
    ContextMenuComponent,
    InplaceModule,
    IssueKanbanCardInfoComponent,
  ],
  templateUrl: './issues-kanban-card-context.component.html',
  styleUrl: './issues-kanban-card-context.component.scss',
})
export class IssuesKanbanCardContextComponent {
  @Input() issueCard!: Element;

  @Input() issue!: Issue;
}
