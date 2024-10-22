import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'rm-bottom-panel',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './bottom-panel.component.html',
  styleUrl: './bottom-panel.component.scss',
})
export class BottomPanelComponent {
  @ContentChild('start') start!: TemplateRef<never>;
  @ContentChild('end') end!: TemplateRef<never>;

  @Input() loading: boolean = false;
}
