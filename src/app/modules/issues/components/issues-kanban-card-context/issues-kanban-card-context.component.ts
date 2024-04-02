import { Component, Input } from '@angular/core';
import { ContextMenuComponent } from '../../../../shared/components/context-menu/context-menu.component';
import Issue from '../../domain/Issue';
import { InplaceModule } from 'primeng/inplace';
import { IssueKanbanCardInfoComponent } from '../issue-kanban-card-info/issue-kanban-card-info.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { Select } from '@ngxs/store';
import RedmineConfigState from '../../../../core/services/redmine-config/store/redmine-config.state';
import { Observable } from 'rxjs';

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
