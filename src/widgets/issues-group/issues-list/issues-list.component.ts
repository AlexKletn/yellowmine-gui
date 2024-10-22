import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Select } from 'primeng/select';

import { IssuesService } from '@features/issues/issues.service';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { RouterToolsService } from '@shared/model/router-tools/router-tools.service';
import { PagePanelComponent } from '@shared/ui/page-panel/page-panel.component';
import { IssuesFilterComponent } from '@widgets/issues-group/issues-filter/issues-filter.component';

@Component({
  selector: 'ym-issues-list',
  standalone: true,
  imports: [
    PagePanelComponent,
    ScrollPanelModule,
    Ripple,
    RouterLink,
    NgClass,
    Select,
    IssuesFilterComponent,
  ],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.scss',
})
export class IssuesListComponent implements OnInit {
  private routerTools = inject(RouterToolsService);
  private issuesService = inject(IssuesService);
  protected filter = new RequestFilter(0, 100);

  issues = this.issuesService.issues(this.filter);

  isActive(url: string, s?: boolean) {
    return this.routerTools.isActive(url, s);
  };

  ngOnInit() {
    this.filter.make();
  }
}
