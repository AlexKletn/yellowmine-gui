import { Component } from '@angular/core';
import IssuesService from '../../issues-service/issues.service';
import { RequestFilterMaker } from '../../../../core/services/redmine-api/Pagination.request';
import { Select, Store } from '@ngxs/store';
import Issue from '../../domain/Issue';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DatePipe, NgIf } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { IssuesKanbanFiltersComponent } from '../issues-kanban-filters/issues-kanban-filters.component';
import IssuesState from '../../store/issues.state';
import { IssuesStoreState } from '../../store/types';
import { Observable } from 'rxjs';
import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';
import {
  IssuesKanbanColunsConfiguratorComponent,
} from '../issues-kanban-coluns-configurator/issues-kanban-coluns-configurator.component';
import ProjectsState from '../../../projects/store/projects.state';
import { ButtonModule } from 'primeng/button';

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
    IssuesKanbanColunsConfiguratorComponent,
    ButtonModule,
  ],
  templateUrl: './issues-list.component.html',
  styleUrl: './issues-list.component.scss',
})
export class IssuesListComponent {
  @Select(IssuesState.currentFilter)
  private issuesFilter$!: Observable<IssuesStoreState['settings']['kanbanFilters']['model']>;

  issuesFilter!: IssuesStoreState['settings']['kanbanFilters']['model'];

  start: number = 0;
  pageSize: number = 25;
  total_count: number = 0;
  isLoading: boolean = false;
  issues: Issue[] = [];
  filter: RequestFilterMaker;

  isReady: boolean = false;
  settingsIsOpen: boolean = false;

  constructor(private issuesService: IssuesService, private store: Store) {
    // const activeProject = store.select(({ projects }) =>
    //   projects.activeProject,
    // ).pipe();

    this.filter = new RequestFilterMaker();
    this.filter.setOffsetPagination(this.start, this.pageSize);
  }

  ngOnInit() {
    this.store.select(ProjectsState.activeProject).subscribe(() => {
      this.updateFilters();
    });
    this.issuesFilter$
      .subscribe((filters) => {
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

      this.issuesService.getIssues(this.filter).subscribe(({ issues, total_count }) => {
        this.issues = issues;
        this.total_count = total_count;
        this.isLoading = false;

        this.isReady = true;
      });
    }
  }

  private updateFilters() {
    const filters = this.issuesFilter;

    if (filters?.isMy) {
      this.filter.setFilter('assigned_to_id', 'me');
    }
    else {
      this.filter.removeFilter('assigned_to_id');
    }

    if (filters?.tag) {
      this.filter.setFilter('tags', filters.tag);
    }
    else {
      this.filter.removeFilter('tags');
    }

    if (filters?.subject) {
      this.filter.setFilter('subject', `~${filters.subject}`);
    }

    this.loadIssues();
  }
}
