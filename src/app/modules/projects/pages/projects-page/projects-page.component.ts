import { Component } from '@angular/core';

import ProjectsListComponent from '../../components/projects-component/projects-list.component';

@Component({
  selector: 'projects-page',
  standalone: true,
  imports: [
    ProjectsListComponent,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsPageComponent {

}
