import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ripple } from 'primeng/ripple';

import Issue from '@entities/issues/model/types';
import { RouterToolsService } from '@shared/model/router-tools/router-tools.service';

@Component({
  selector: 'ym-issues-list-item',
  standalone: true,
  imports: [
    Ripple,
    NgClass,
    RouterLink,
  ],
  templateUrl: './issues-list-item.component.html',
  styleUrl: './issues-list-item.component.scss',
})
export class IssuesListItemComponent {
  @Input({ required: true }) issue!: Issue;

  private routerTools = inject(RouterToolsService);

  isActive(url: string, s?: boolean) {
    return this.routerTools.isActive(url, s);
  };
}
