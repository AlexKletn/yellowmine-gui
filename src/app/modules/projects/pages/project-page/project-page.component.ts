import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  private title = inject(Title);

  id?: number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(({ id }) => {
      this.id = id;
    });
  }

  ngOnInit() {
    this.title.setTitle(`Redmine - ${this.id}`);
  }
}
