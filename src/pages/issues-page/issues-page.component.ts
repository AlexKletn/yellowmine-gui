import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';
import { IssuesListComponent } from '@widgets/issues-group/issues-list/issues-list.component';

@Component({
  selector: 'ym-issues-page',
  standalone: true,
  imports: [
    IssuesListComponent,
    PagePanelComponent,
    RouterOutlet,
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss',
})
export class IssuesPageComponent {
  constructor() {
  }
}
