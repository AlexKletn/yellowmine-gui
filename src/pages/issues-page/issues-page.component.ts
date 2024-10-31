import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';
import { IssuesFilterComponent } from '@widgets/issues-group/issues-filter/issues-filter.component';
import { IssuesListComponent } from '@widgets/issues-group/issues-list/issues-list.component';

@Component({
  selector: 'ym-issues-page',
  standalone: true,
  imports: [
    IssuesListComponent,
    PagePanelComponent,
    RouterOutlet,
    ButtonModule,
    IssuesFilterComponent,
    NgClass,
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss',
})
export class IssuesPageComponent {
  listHidden = signal(false);

  hideIcon = computed(() => this.listHidden() ? 'pi pi-arrow-circle-right' : 'pi pi-arrow-circle-left');

  toggleListHidden() {
    this.listHidden.set(!this.listHidden());
  }
}
