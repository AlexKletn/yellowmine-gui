import { Component, ContentChild, EventEmitter, inject, Input, Output, Renderer2, TemplateRef } from '@angular/core';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { NgClass, NgForOf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { KanbanColumn, KanbanItem } from './types';
import { DragDropModule } from 'primeng/dragdrop';
import MouseService from '../../service/mouse.service';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgScrollbar } from 'ngx-scrollbar';
import { BaseModel } from '../../../core/services/redmine-api/types';
import { Select, Store } from '@ngxs/store';
import KanbanState from './store/Kanban.state';
import { Observable } from 'rxjs';
import { SetCurrentItem } from './store/actions/setItem.action';
import deepClone from 'deep-clone';

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
export class KanbanComponent<Item extends BaseModel, Additional = unknown> {
  private store = inject(Store);

  @ContentChild('data') data!: TemplateRef<{ item: Item }>;

  @Select(KanbanState.currentItem)
  private currentItem$!: Observable<Item>;

  @Input() columns!: KanbanColumn[];
  @Input() additional!: Additional;
  @Input() items!: { [key: string]: Item[] };

  @Output() onChange = new EventEmitter<{ item: KanbanItem<Item, Additional>; newColumn: KanbanColumn }>();

  draggedItem?: Item;
  draggedItemWidth?: number;
  draggedCoords: { x: number; y: number } = { x: 0, y: 0 };
  private renderer = inject(Renderer2);

  constructor(private mouseService: MouseService) {
    this.setActiveItem(undefined);
    this.currentItem$.subscribe((item: Item) => {
      this.draggedItem = { ...item };
    });
  }

  dragStartHandler(item: Item, event: DragEvent) {
    const { x, y } = this.mouseService.getElementMouseOffset(event.target as HTMLElement);

    const dragNode = event.target as HTMLElement;

    setTimeout(() => {
      this.renderer.setStyle(dragNode, 'pointer-events', 'none');
      this.renderer.setStyle(dragNode, 'display', 'none');
    }, 10);

    event.dataTransfer!.setDragImage(dragNode as HTMLElement, x, y);

    this.draggedItemWidth = (event.target as HTMLElement).getBoundingClientRect().width;

    this.setActiveItem(item);
  }

  dragEndHandler(event: DragEvent) {
    this.setActiveItem(undefined);
    this.renderer.setStyle(event.target, 'pointer-events', 'unset');
    this.renderer.setStyle(event.target, 'display', 'block');
  }

  dropHandler(columnId: KanbanColumn) {
    if (this.draggedItem) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const clonedItem = deepClone(this.draggedItem) as Item;

      this.onChange.emit({
        item: {
          item: clonedItem,
          additional: this.additional,
        },
        newColumn: columnId,
      });
      this.setActiveItem(undefined);
    }
  }

  getTrackByKey(index: number, item: Item) {
    return item.id;
  }

  getTrackByColumnKey(index: number, { id }: KanbanColumn) {
    return id;
  }

  private setActiveItem(item?: Item) {
    this.store.dispatch(new SetCurrentItem(item));
  }
}
