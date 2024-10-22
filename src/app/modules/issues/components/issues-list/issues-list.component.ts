import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { combineLatestWith, Observable } from 'rxjs';

import { RequestFilterMaker } from '@shared/api/redmine-api/RequestFilter';

import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';
import ProjectsState from '../../../projects/store/projects.state';
import Issue from '../../domain/Issue';
import IssuesService from '../../issues-service/issues.service';
import IssuesState from '../../store/issues.state';
import { IssuesStoreState } from '../../store/types';
import { IssueViewComponent } from '../issue-view/issue-view.component';
import {
  IssuesKanbanColumnsConfiguratorComponent,
} from '../issues-kanban-coluns-configurator/issues-kanban-columns-configurator.component';
import { IssuesKanbanFiltersComponent } from '../issues-kanban-filters/issues-kanban-filters.component';

@Component({
  selector: 'rm-issues-list',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    TagModule,
    NgIf,
    RouterLink,
    IssuesKanbanFiltersComponent,
    BottomPanelComponent,
    IssuesKanbanColumnsConfiguratorComponent,
    ButtonModule,
    IssueViewComponent,
    NgClass,
  ],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.scss',
})
export class IssuesListComponent {
  @Select(IssuesState.currentFilter)
  private issuesFilter$!: Observable<IssuesStoreState['settings']['kanbanFilters']['model']>;

  private _selectedIssue?: Issue;

  issuesFilter!: IssuesStoreState['settings']['kanbanFilters']['model'];

  start: number = 0;
  pageSize: number = 25;
  total_count: number = 0;
  isLoading: boolean = false;
  issues: Issue[] = [];
  filter: RequestFilterMaker;

  isReady: boolean = false;

  constructor(private issuesService: IssuesService, private store: Store) {
    this.filter = new RequestFilterMaker();
    this.filter.setOffsetPagination(this.start, this.pageSize);
  }

  ngOnInit() {
    const activeProject$ = this.store.select(ProjectsState.activeProject);
    this.issuesFilter$
      .pipe(
        combineLatestWith(activeProject$),
      )
      .subscribe(([filters]) => {
        this.issuesFilter = filters;

        this.updateFilters();
      });
  }

  lazyLoadIssues({ first, rows }: TableLazyLoadEvent) {
    this.filter.setOffsetPagination(first!, rows!);
    this.start = first!;
    this.pageSize = rows!;
    this.loadIssues();
  }

  loadIssues() {
    if (this.filter) {
      this.isLoading = true;

      this.issuesService.getProjectIssues(this.filter).subscribe(({ issues, total_count }) => {
        this.issues = issues;
        this.total_count = total_count;
        this.isLoading = false;

        this.isReady = true;
      });
    }
  }

  issueSelectHandler(issue: Issue) {
    this.selectedIssue = issue;
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

  issueViewCloseHandler() {
    this.selectedIssue = undefined;
  }

  private updateFilters() {
    const filters = this.issuesFilter;

    if (filters?.tag) {
      this.filter.setFilter('tags', filters.tag);
    }
    else {
      this.filter.removeFilter('tags');
    }

    if (filters?.subject) {
      this.filter.setFilter('subject', `~${filters.subject}`);
    }

    if (filters.isMy) {
      this.filter.setFilter('assigned_to_id', 'me');
    }
    else {
      this.filter.removeFilter('assigned_to_id');

      if (filters.assignedTo) {
        this.filter.setFilter('assigned_to_ids', filters.assignedTo);
      }
      else {
        this.filter.removeFilter('assigned_to_ids');
      }
    }

    this.loadIssues();
  }
}
