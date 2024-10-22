import { DOCUMENT, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Inject, inject, Input, TemplateRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

import MouseService from '../../service/mouse.service';

@Component({
  selector: 'rm-context-menu',
  standalone: true,
  imports: [
    MenuModule,
    NgIf,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  @ContentChild('top') top!: TemplateRef<never>;
  @ContentChild('bottom') bottom!: TemplateRef<never>;

  @Input() target!: Element;
  @Input() model!: MenuItem[];

  private mouseService: MouseService = inject(MouseService);
  private mouseCoords: { x: number; y: number } = { x: 0, y: 0 };

  isOpen = false;

  menuPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.mouseService.mouseCoords$.subscribe((coords) => {
      this.mouseCoords = coords;
    });
  }

  ngOnInit() {
    this.document.addEventListener('mousedown', () => {
      this.isOpen = false;
    });

    this.target.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // e.stopPropagation();
      this.isOpen = true;

      const { x, y } = this.mouseCoords;

      this.menuPosition = { x, y };
    });
  }

  containerClickHandler(event: MouseEvent) {
    event.stopPropagation();
    if (event.type === 'mousedown') {
      event.preventDefault();
    }
  }
}
