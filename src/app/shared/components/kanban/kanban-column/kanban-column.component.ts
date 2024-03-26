import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DragDropModule } from 'primeng/dragdrop';
import { KanbanElementComponent } from '../kanban-element/kanban-element.component';
import { NgForOf, NgTemplateOutlet } from '@angular/common';
import { DndDropzoneDirective } from 'ngx-drag-drop';
import { KanbanColumn } from '../types';

@Component({
  selector: 'rm-kanban-column',
  standalone: true,
  imports: [
    PanelModule,
    DragDropModule,
    KanbanElementComponent,
    NgForOf,
    NgTemplateOutlet,
    DndDropzoneDirective,
  ],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
  @Input() column!: KanbanColumn;
  @Output() onDrop = new EventEmitter<string>();

  dropHandler() {
    this.onDrop.emit();
  }
}
