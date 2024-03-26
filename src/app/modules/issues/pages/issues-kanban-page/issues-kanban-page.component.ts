import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IssuesKanbanComponent } from '../../components/issues-kanban/issues-kanban.component';

@Component({
  selector: 'rm-issues-kanban-page',
  standalone: true,
  imports: [
    IssuesKanbanComponent,
  ],
  providers: [MessageService],
  templateUrl: './issues-kanban-page.component.html',
  styleUrl: './issues-kanban-page.component.scss',
})
export class IssuesKanbanPageComponent {
}
