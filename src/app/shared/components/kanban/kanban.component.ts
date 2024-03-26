import { Component, ContentChild, EventEmitter, inject, Input, Output, Renderer2, TemplateRef } from '@angular/core';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { NgClass, NgForOf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { KanbanColumn, KanbanItem } from './types';
import { DragDropModule } from 'primeng/dragdrop';
import MouseService from '../../service/mouse.service';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'rm-kanban',
  standalone: true,
  imports: [
    KanbanColumnComponent,
    NgForOf,
    NgTemplateOutlet,
    DragDropModule,
    NgClass,
    NgStyle,
    DividerModule,
    ScrollPanelModule,
    NgScrollbar,
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent<Item extends KanbanItem> {
  @ContentChild('data') data!: TemplateRef<{ item: Item }>;

  @Input() columns!: KanbanColumn[];
  @Input() items!: { [key: string]: Item[] };

  @Input() filter!: (item: Item) => boolean;

  @Output() onChange = new EventEmitter<{ item: Item; newColumn: KanbanColumn }>();

  draggedItem?: Item;
  draggedItemWidth?: number;
  draggedCoords: { x: number; y: number } = { x: 0, y: 0 };
  private renderer = inject(Renderer2);

  constructor(private mouseService: MouseService) {
  }

  dragStartHandler(item: Item, event: DragEvent, id: number) {
    const { x, y } = this.mouseService.getElementMouseOffset(event.target as HTMLElement);

    const dragNode = event.target as HTMLElement;

    setTimeout(() => {
      this.renderer.setStyle(dragNode, 'pointer-events', 'none');
      this.renderer.setStyle(dragNode, 'display', 'none');
    }, 10);

    event.dataTransfer!.setDragImage(dragNode as HTMLElement, x, y);

    this.draggedItemWidth = (event.target as HTMLElement).getBoundingClientRect().width;

    this.draggedItem = item;
  }

  dragEndHandler(event: DragEvent) {
    this.draggedItem = undefined;
    this.renderer.setStyle(event.target, 'pointer-events', 'unset');
    this.renderer.setStyle(event.target, 'display', 'block');
  }

  dropHandler(columnId: KanbanColumn) {
    this.onChange.emit({
      item: this.draggedItem!,
      newColumn: columnId,
    });
    this.draggedItem = undefined;
  }

  getTrackByKey(index: number, { id }: Item) {
    return id;
  }

  getTrackByColumnKey(index: number, { id }: KanbanColumn) {
    return id;
  }
}
