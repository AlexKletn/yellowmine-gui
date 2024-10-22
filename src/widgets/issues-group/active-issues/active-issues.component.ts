import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { IssuesService } from '@features/issues/issues.service';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';
import { RouterToolsService } from '@shared/model/router-tools/router-tools.service';

@Component({
  selector: 'ym-active-issues',
  standalone: true,
  imports: [
    ButtonModule,
    Ripple,
    RouterLink,
  ],
  templateUrl: './active-issues.component.html',
  styleUrl: './active-issues.component.scss',
})
export class ActiveIssuesComponent {
  private routerTools = inject(RouterToolsService);
  private issuesService = inject(IssuesService);
  protected filter = new RequestFilter(0, 10);

  issues = this.issuesService.issues(this.filter);

  isActive(url: string, s?: boolean) {
    return this.routerTools.isActive(url, s);
  };

  ngOnInit() {
    this.filter
      .setFilters({
        status_id: '2',
        assigned_to_id: 'me',
      })
      .make();
  }
}
