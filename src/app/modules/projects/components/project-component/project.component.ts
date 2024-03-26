import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import ProjectsService from '../../services/projects.service';
import { PanelModule } from 'primeng/panel';
import { NgIf } from '@angular/common';
import Project from '../../domain/Project';

@Component({
  selector: 'project-view',
  templateUrl: 'project.component.html',
  imports: [CardModule, PanelModule, NgIf],
  standalone: true,
  styleUrl: 'project.component.scss',
})
class ProjectComponent {
  @Input() id?: number;
  project?: Project = undefined;

  constructor(private projectsService: ProjectsService) {
    this.projectsService.activeProject.subscribe({ next: (data) => {
      this.project = data;
    } });
  }

  ngOnInit() {
    if (this.id) {
      this.projectsService.setActiveProject(this.id);
    }
  }
}

export default ProjectComponent;
