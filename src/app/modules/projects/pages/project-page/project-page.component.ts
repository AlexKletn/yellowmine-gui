import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ProjectComponent from '../../components/project-component/project.component';

@Component({
  selector: 'project-page',
  standalone: true,
  imports: [
    ProjectComponent,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent {
  id?: number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(({ id }) => {
      this.id = id;
    });
  }
}
