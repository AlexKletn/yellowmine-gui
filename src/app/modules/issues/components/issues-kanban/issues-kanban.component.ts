import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Select } from '@ngxs/store';
import deepClone from 'deep-clone';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, skip } from 'rxjs';

import { RequestFilterMaker } from '@shared/api/redmine-api/RequestFilter';

import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';
import { EmptyComponent } from '../../../../shared/components/empty/empty.component';
import { KanbanComponent } from '../../../../shared/components/kanban/kanban.component';
import { KanbanItem } from '../../../../shared/components/kanban/types';
import { IssueStatus } from '../../../issue-statuses/domain/IssueStatus';
import ProjectsState from '../../../projects/store/projects.state';
import Issue from '../../domain/Issue';
import IssuesService from '../../issues-service/issues.service';
import IssuesState from '../../store/issues.state';
import { IssuesStoreState } from '../../store/types';
import { IssueViewComponent } from '../issue-view/issue-view.component';
import { IssuesKanbanCardComponent } from '../issues-kanban-card/issues-kanban-card.component';
import { IssuesKanbanCardContextComponent } from '../issues-kanban-card-context/issues-kanban-card-context.component';
import {
  IssuesKanbanColumnsConfiguratorComponent,
} from '../issues-kanban-coluns-configurator/issues-kanban-columns-configurator.component';
import { IssuesKanbanFiltersComponent } from '../issues-kanban-filters/issues-kanban-filters.component';

const UNASSIGNED = '* Нет исполнителя';

type IssuesByAssigned = { [key: string]: {
  items: {
    [key: string]: Issue[];
  };
  columnAssigned: Issue['assigned_to'];
}; };

@Component({
  selector: 'rm-issues-kanban',
  standalone: true,
  imports: [
    KanbanComponent,
    KeyValuePipe,
    ProgressSpinnerModule,
    IssuesKanbanCardComponent,
    IssuesKanbanFiltersComponent,
    ButtonModule,
    IssuesKanbanColumnsConfiguratorComponent,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    TooltipModule,
    EmptyComponent,
    BottomPanelComponent,
    DialogModule,
    IssuesKanbanCardContextComponent,
    IssueViewComponent,
    JsonPipe,
  ],
  templateUrl: './issues-kanban.component.html',
  styleUrl: './issues-kanban.component.scss',
})
export class IssuesKanbanComponent {
  private messageService = inject(MessageService);
  private issuesService = inject(IssuesService);
  private _selectedIssue?: Issue;

  @Select(IssuesState.currentFilter)
  currentFilter$!: Observable<Record<string, unknown>>;

  @Select(IssuesState.activeIssueStatuses)
  activeIssueStatuses$!: Observable<IssueStatus[]>;

  @Select(ProjectsState.activeProject)
  activeProject$!: Observable<IssueStatus[]>;

  activeIssueStatuses!: IssueStatus[];

  issuesFilterMaker: RequestFilterMaker = new RequestFilterMaker(0, 100);
  issues: Issue[] = [];
  issuesByAssigned: { [key: string]: Issue[] } = {};
  issuesByAssignedAndStatus: IssuesByAssigned = {};

  isLoading: boolean = true;
  issuesInUpdate: Set<Issue['id']> = new Set<Issue['id']>();

  ngOnInit() {
    this.issuesFilterMaker.setFilter('status_id', '*');
    this.issuesFilterMaker.setFilter('set_filter', 1);

    this.init();
  }

  get selectedIssue(): Issue | undefined {
    return this._selectedIssue;
  }

  set selectedIssue(issue: Issue | undefined | boolean) {
    if (typeof issue === 'boolean') {
      this._selectedIssue = undefined;
    }
    else {
      this._selectedIssue = issue;
    }
  }

  ngAfterViewInit() {
    this.activeProject$.pipe(
      skip(1),
    ).subscribe(() => {
      this.loadIssues();
    });
    this.loadIssues();
  }

  changeHandler({ item, additional }: KanbanItem<Issue, Issue['assigned_to']>, newStatus: IssueStatus) {
    const targetIssue = this.issues.find(issue => issue.id === item.id);

    if (targetIssue) {
      // const taskAssigned = targetIssue.assigned_to?.name ?? UNASSIGNED;
      targetIssue.status = newStatus;
      targetIssue.assigned_to = additional;

      this.issuesByAssignedAndStatus = this.sortIssuesByAssigned();

      this.issuesInUpdate.add(targetIssue.id);

      this.issuesService.updateIssue({
        id: targetIssue.id,
        status_id: newStatus.id,
        assigned_to_id: additional?.id,
      }).subscribe(() => {
        this.loadIssues(true).subscribe(({ issues }) => {
          const updatedIssue = issues.find(issue => issue.id === targetIssue.id);

          if (updatedIssue?.status.id !== newStatus.id || updatedIssue?.assigned_to?.id !== additional?.id) {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Данное перемещение невозможно', life: 3000 });
          }
          this.issuesInUpdate.delete(targetIssue.id);
        });
      });
    }
  }

  issueModalSwitch(issue?: Issue) {
    this.selectedIssue = issue;
  }

  getTrackByUserKey(index: number) {
    return index;
  }

  loadIssues(noLoading: boolean = false) {
    this.isLoading = !noLoading;
    const loadRequest = this.issuesService.getProjectIssues(this.issuesFilterMaker);

    loadRequest.subscribe(({ issues }) => {
      this.issues = issues;

      this.sortIssuesByAssigned();

      this.isLoading = false;
    });

    return loadRequest;
  }

  issueViewCloseHandler() {
    this.selectedIssue = undefined;
  }

  private sortIssuesByAssigned() {
    const issuesByAssigned: { [key: string]: Issue[] } = {};

    this.issues.forEach((issue) => {
      const assignedKey = issue.assigned_to?.name ?? UNASSIGNED;

      issuesByAssigned[assignedKey] = issuesByAssigned[assignedKey] || [];
      issuesByAssigned[assignedKey].push(issue);
    });

    this.issuesByAssigned = issuesByAssigned;

    const issuesByAssignedEntries = Object.entries(issuesByAssigned).map(([assignedKey, issues]) => {
      return [assignedKey, {
        items: this.sortIssuesByStatus(issues),
        columnAssigned: issues[0].assigned_to ?? { name: UNASSIGNED },
      }];
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.issuesByAssignedAndStatus = deepClone(Object.fromEntries(issuesByAssignedEntries)) as IssuesByAssigned;

    return this.issuesByAssignedAndStatus;
  }

  private sortIssuesByStatus(issues: Issue[] = this.issues) {
    const issuesByStatus: { [key: string]: Issue[] } = {};

    issues.forEach((issue) => {
      issuesByStatus[issue.status.id] = issuesByStatus[issue.status.id] || [];
      issuesByStatus[issue.status.id].push(issue);
    });

    return issuesByStatus;
  }

  private updateFilters(filters: IssuesStoreState['settings']['kanbanFilters']['model']) {
    if (filters.tag) {
      this.issuesFilterMaker.setFilter('tags', filters.tag);
    }
    else {
      this.issuesFilterMaker.removeFilter('tags');
    }

    if (filters.subject) {
      this.issuesFilterMaker.setFilter('subject', `~${filters.subject}`);
    }
    else {
      this.issuesFilterMaker.removeFilter('subject');
    }

    if (filters.isMy) {
      this.issuesFilterMaker.setFilter('assigned_to_id', 'me');
    }
    else {
      this.issuesFilterMaker.removeFilter('assigned_to_id');

      if (filters.assignedTo) {
        this.issuesFilterMaker.setFilter('assigned_to_ids', filters.assignedTo);
      }
      else {
        this.issuesFilterMaker.removeFilter('assigned_to_ids');
      }
    }

    return;
  }

  private init() {
    this.activeIssueStatuses$.subscribe((activeIssueStatuses) => {
      this.activeIssueStatuses = activeIssueStatuses;
    });

    this.currentFilter$.subscribe((filter) => {
      this.updateFilters(filter);
      this.loadIssues();
    });
  }
}
