import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { InplaceModule } from 'primeng/inplace';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Observable } from 'rxjs';

import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';

import { ContextMenuComponent } from '../../../../shared/components/context-menu/context-menu.component';
import Issue from '../../domain/Issue';
import { IssueKanbanCardInfoComponent } from '../issue-kanban-card-info/issue-kanban-card-info.component';

@Component({
  selector: 'rm-issues-kanban-card-context',
  standalone: true,
  imports: [
    ContextMenuComponent,
    InplaceModule,
    IssueKanbanCardInfoComponent,
    TieredMenuModule,
  ],
  templateUrl: './issues-kanban-card-context.component.html',
  styleUrl: './issues-kanban-card-context.component.scss',
})
export class IssuesKanbanCardContextComponent {
  @Select(RedmineConfigState.redmineUrl)
  private redmineUrl$!: Observable<string>;

  private redmineUrl?: string;

  @Input() issueCard!: Element;

  @Input() issue!: Issue;

  menuItems!: MenuItem[];

  constructor() {
  }

  ngOnInit(): void {
    this.redmineUrl$.subscribe((url) => {
      this.redmineUrl = url;

      this.menuItems = [
        {
          label: 'Open in Redmine',
          icon: 'pi pi-external-link',
          url: `${url}/issues/${this.issue.id}`,
        },
      ];
    });
  }

  openInRedmine() {
    window.open(`${this.redmineUrl}/issues/${this.issue.id}`, '_blank');
  }
}
