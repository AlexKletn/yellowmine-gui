import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import ProjectsService from '../../services/projects.service';
import { Router } from '@angular/router';
import Project from '../../domain/Project';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'projects-list',
  templateUrl: 'projects-list.component.html',
  imports: [CardModule, TagModule],
  standalone: true,
  styleUrl: 'projects-list.component.scss',
})
class ProjectsListComponent {
  projects: Array<Project> = [];

  constructor(private projectsService: ProjectsService, private router: Router) {}

  ngOnInit() {
    this.projectsService.projects.subscribe({ next: (data) => {
      this.projects = data;
    } });
  }

  openProject(id: Project['id']) {
    this.projectsService.setActiveProject(id);
    this.router.navigate([`/issues`]);
  }
}

export default ProjectsListComponent;
