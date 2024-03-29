import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DragDropModule } from 'primeng/dragdrop';
import { KanbanElementComponent } from '../kanban-element/kanban-element.component';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { DndDropzoneDirective } from 'ngx-drag-drop';
import { KanbanColumn } from '../types';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
    NgIf,
  ],
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
  @Input() column!: KanbanColumn;
  @Output() onDrop = new EventEmitter<string>();

  collapsed: boolean = false;

  dropHandler() {
    this.onDrop.emit();
  }

  collapseSwitch() {
    this.collapsed = !this.collapsed;
  }
}
