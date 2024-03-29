import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { KanbanComponent } from './shared/components/kanban/kanban.component';
import { ToastModule } from 'primeng/toast';
import ProjectsService from './modules/projects/services/projects.service';
import { Select } from '@ngxs/store';
import RedmineConfigState from './core/services/redmine-config/store/redmine-config.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    RouterLink,
    KanbanComponent,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private projectsService = inject(ProjectsService);

  @Select(RedmineConfigState.apiKey)
  private redmineConfig$!: Observable<string>;

  ngOnInit() {
    this.projectsService.loadProjects();

    this.redmineConfig$.subscribe((key) => {
      if (key) {
        this.projectsService.loadProjects();
      }
    });
  }
}
