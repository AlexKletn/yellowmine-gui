import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import IssuesState from '../../store/issues.state';
import { Observable, skip } from 'rxjs';
import { IssueStatus } from '../../../issue-statuses/domain/IssueStatus';
import { RequestFilterMaker } from '../../../../core/services/redmine-api/Pagination.request';
import Issue from '../../domain/Issue';
import IssuesService from '../../issues-service/issues.service';
import { IssuesStoreState } from '../../store/types';
import { KanbanComponent } from '../../../../shared/components/kanban/kanban.component';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IssuesKanbanCardComponent } from '../issues-kanban-card/issues-kanban-card.component';
import { IssuesKanbanFiltersComponent } from '../issues-kanban-filters/issues-kanban-filters.component';
import { ButtonModule } from 'primeng/button';
import {
  IssuesKanbanColunsConfiguratorComponent,
} from '../issues-kanban-coluns-configurator/issues-kanban-coluns-configurator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import ProjectsState from '../../../projects/store/projects.state';
import { EmptyComponent } from '../../../../shared/components/empty/empty.component';
import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';

const UNASSIGNED = '* Нет исполнителя';

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
    IssuesKanbanColunsConfiguratorComponent,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    TooltipModule,
    EmptyComponent,
    BottomPanelComponent,
  ],
  templateUrl: './issues-kanban.component.html',
  styleUrl: './issues-kanban.component.scss',
})
export class IssuesKanbanComponent {
  private messageService = inject(MessageService);
  private store = inject(Store);
  private issuesService = inject(IssuesService);

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
  issuesByAssignedAndStatus: { [key: string]: { [key: string]: Issue[] } } = {};

  settingsIsOpen: boolean = false;
  isLoading: boolean = true;
  issuesInUpdate: Set<Issue['id']> = new Set<Issue['id']>();

  ngOnInit() {
    this.issuesFilterMaker.setFilter('status_id', '*');
    this.issuesFilterMaker.setFilter('set_filter', 1);

    this.init();
  }

  ngAfterViewInit() {
    this.activeProject$.pipe(
      skip(1),
    ).subscribe(() => {
      this.loadIssues();
    });
    this.loadIssues();
  }

  changeHandler(item: Issue, newStatus: IssueStatus) {
    const targetIssue = this.issues.find(issue => issue.id === item.id);

    if (targetIssue) {
      const taskAssigned = targetIssue.assigned_to?.name ?? UNASSIGNED;
      targetIssue.status = newStatus;

      this.issuesByAssignedAndStatus[taskAssigned] = this.sortIssuesByStatus(this.issuesByAssigned[taskAssigned]);

      this.issuesInUpdate.add(targetIssue.id);

      this.issuesService.updateIssue({
        id: targetIssue.id,
        status_id: newStatus.id,
      }).subscribe(() => {
        this.loadIssues(true).subscribe(({ issues }) => {
          const updatedIssue = issues.find(issue => issue.id === targetIssue.id);

          if (updatedIssue?.status.id !== newStatus.id) {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Данное перемещение невозможно', life: 3000 });
          }
          this.issuesInUpdate.delete(targetIssue.id);
        });
      });
    }
  }

  openSettingsHandler() {
    this.settingsIsOpen = true;
  }

  getTrackByStatusKey(index: unknown, { id }: IssueStatus) {
    return id;
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

  private sortIssuesByAssigned() {
    const issuesByAssigned: { [key: string]: Issue[] } = {};

    this.issues.forEach((issue) => {
      const assignedKey = issue.assigned_to?.name ?? UNASSIGNED;

      issuesByAssigned[assignedKey] = issuesByAssigned[assignedKey] || [];
      issuesByAssigned[assignedKey].push(issue);
    });

    this.issuesByAssigned = issuesByAssigned;

    const issuesByAssignedEntries = Object.entries(issuesByAssigned).map(([assignedKey, issues]) => {
      return [assignedKey, this.sortIssuesByStatus(issues)];
    });

    this.issuesByAssignedAndStatus = Object.fromEntries(issuesByAssignedEntries);
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

    const assigned_to = filters.isMy ? 'me' : '*';

    this.issuesFilterMaker.setFilter('assigned_to_id', assigned_to);
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
