import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'ym-page-panel',
  standalone: true,
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './page-panel.component.html',
  styleUrl: './page-panel.component.scss',
})
export class PagePanelComponent {
  @ContentChild('header') header!: TemplateRef<never>;
  @ContentChild('footer') footer!: TemplateRef<never>;

  @Input() loading: boolean = false;
}
