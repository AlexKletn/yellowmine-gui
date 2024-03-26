import { Component } from '@angular/core';
import { ProjectsSelectComponent } from '../projects-select/projects-select.component';
import ProjectsService from '../../services/projects.service';
import Project from '../../domain/Project';

@Component({
  selector: 'rm-project-global-select',
  standalone: true,
  imports: [
    ProjectsSelectComponent,
  ],
  templateUrl: './project-global-select.component.html',
  styleUrl: './project-global-select.component.scss',
})
export class ProjectGlobalSelectComponent {
  activeProject!: Project['id'];

  constructor(private projectsService: ProjectsService) {
    this.projectsService.activeProject.subscribe((active) => {
      this.activeProject = active?.id;
    });
  }

  selectProject(id: number) {
    this.projectsService.setActiveProject(id);
  }
}
