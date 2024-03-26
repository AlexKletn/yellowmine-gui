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
  total_count: number = 10000;
  loading: boolean = false;
  issues: Issue[] = [];
  filter: RequestFilterMaker;

  isReady: boolean = false;

  constructor(private issuesService: IssuesService, private store: Store) {
    // const activeProject = store.select(({ projects }) =>
    //   projects.activeProject,
    // ).pipe();

    this.issuesFilter$
      .subscribe((filters) => {
        this.issuesFilter = filters;

        this.updateFilters();
      });

    this.filter = new RequestFilterMaker();
    this.filter.setOffsetPagination(this.start, this.pageSize);
  }

  lazyLoadIssues({ first, rows }: TableLazyLoadEvent) {
    this.filter.setOffsetPagination(first!, rows!);
    this.start = first!;
    this.pageSize = rows!;
    this.loadIssues();
  }

  private loadIssues() {
    this.loading = true;
    this.issuesService.getIssues(this.filter).subscribe(({ issues, total_count }) => {
      this.issues = issues;
      this.total_count = total_count;
      this.loading = false;

      this.isReady = true;
    });
  }

  private updateFilters() {
    const filters = this.issuesFilter;

    if (filters.tag) {
      this.filter.setFilter('tags', filters.tag);
    }
    else {
      this.filter.removeFilter('tags');
    }
    const assigned_to = filters.isMy ? 'me' : '*';

    this.filter.setFilter('assigned_to_id', assigned_to);

    this.loadIssues();
  }
}
