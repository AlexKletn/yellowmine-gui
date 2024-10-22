import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

import { BottomPanelComponent } from '../../../../shared/components/bottom-panel/bottom-panel.component';
import Project from '../../domain/Project';
import ProjectsService from '../../services/projects.service';

@Component({
  selector: 'projects-list',
  templateUrl: 'projects-list.component.html',
  imports: [CardModule, TagModule, BottomPanelComponent, PaginatorModule, ChipsModule],
  standalone: true,
  styleUrl: 'projects-list.component.scss',
})
class ProjectsListComponent {
  projects: Array<Project> = [];

  projectsPage: Array<Project> = [];
  totalCount: number = 0;

  constructor(private projectsService: ProjectsService, private router: Router) {}

  ngOnInit() {
    this.projectsService.projects.subscribe({
      next: (data) => {
        this.projects = [...data];

        this.sliceProjects(0, 25);
        this.totalCount = this.projects.length;
      },
    });
  }

  openProject(id: Project['id']) {
    this.projectsService.setActiveProject(id);
    this.router.navigate([`/issues`]);
  }

  changePageHandler({ first, rows }: PaginatorState) {
    this.sliceProjects(first ?? 0, rows ?? 25);
  }

  private _search: string = '';

  get search() {
    return this._search;
  }

  set search(value) {
    if (value) {
      this._search = value;

      const searchRegex = new RegExp(value, 'i');

      const found = this.projects.filter(({ name }) => searchRegex.test(name));

      this.projectsPage = found;
      this.totalCount = found.length;
    }
    else {
      this.sliceProjects(0, 25);
      this.totalCount = this.projects.length;
    }
  }

  private sliceProjects(start: number, count: number) {
    this.projectsPage = this.projects.slice(start, start + count);
  }
}

export default ProjectsListComponent;
