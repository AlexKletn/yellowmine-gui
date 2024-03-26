import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
  selector: 'rm-kanban-element',
  standalone: true,
  imports: [
    CardModule,
    DragDropModule,
  ],
  templateUrl: './kanban-element.component.html',
  styleUrl: './kanban-element.component.scss',
})
export class KanbanElementComponent {

}
