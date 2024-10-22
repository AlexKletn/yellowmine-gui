import { Component, inject, Input, OnInit } from '@angular/core';
import { Select } from 'primeng/select';

import { ProjectsService } from '@features/projects';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';

@Component({
  selector: 'ym-issues-filter',
  standalone: true,
  imports: [
    Select,
  ],
  templateUrl: './issues-filter.component.html',
  styleUrl: './issues-filter.component.scss',
})
export class IssuesFilterComponent implements OnInit {
  @Input({ required: true }) filter!: RequestFilter;

  private projectsService = inject(ProjectsService);
  private projectsFilter = new RequestFilter(0, 100);
  projects = this.projectsService.projects(this.projectsFilter);

  ngOnInit() {
    this.projectsFilter
      .setFilter('status_id', 1)
      .make();
  }

  setFilter(name: string, value: string | number) {
    console.log(value);
    this.filter.setFilter(name, value);
    this.filter.make();
  };
}
