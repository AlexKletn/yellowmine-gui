import { Component, EventEmitter, Input, Output } from '@angular/core';
import Project from '../../domain/Project';
import ProjectsService from '../../services/projects.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'projects-select',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './projects-select.component.html',
  styleUrl: './projects-select.component.scss',
})
export class ProjectsSelectComponent {
  projects: Array<Project> = [];
  activeProject?: Project['id'];

  constructor(private projectsService: ProjectsService) {
    this.projectsService.projects.subscribe({ next: (data) => {
      this.projects = data.filter(project => project.status === 1);
    } });

    this.projectsService.activeProject.subscribe((active) => {
      this.value = active?.id;
    });
  }

  @Input() value!: Project['id'];
  @Output() onChanged = new EventEmitter<Project['id']>();
  changeHandler(newId: Project['id']) {
    this.onChanged.emit(newId);
  }
}
