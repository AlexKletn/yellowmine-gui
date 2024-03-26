import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';
import { ProjectsSelectComponent } from '../../modules/projects/components/projects-select/projects-select.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import {
  ProjectGlobalSelectComponent,
} from '../../modules/projects/components/project-global-select/project-global-select.component';
import { Select } from '@ngxs/store';
import RedmineConfigState from '../../core/services/redmine-config/store/redmine-config.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, RouterLink, ProjectsSelectComponent, MenubarModule, ProjectGlobalSelectComponent],
  templateUrl: './header.component.html',
  styleUrl: 'header.component.scss',
})
export class HeaderComponent {
  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  constructor() {
    this.apiKey$.subscribe((key) => {
      if (key) {
        this.menuItems = [
          {
            label: 'Домашняя',
            routerLink: '/',
            routerLinkActiveOptions: true,
          },
          {
            label: 'Проекты',
            routerLink: '/projects',
            routerLinkActiveOptions: true,
          },
          {
            label: 'Задачи',
            routerLink: '/issues',
            routerLinkActiveOptions: true,
          },
          {
            label: 'Доска',
            routerLink: '/issues/kanban',
            routerLinkActiveOptions: true,
          },
          {
            label: 'Трудозатраты',
            disabled: true,
          },
          {
            label: 'Создать задачу',
            disabled: true,
          },
        ];
      }
      else {
        this.menuItems = [
          {
            label: 'Домашняя',
            routerLink: '/',
            routerLinkActiveOptions: true,
          },
        ];
      }
    });
  }

  menuItems: MenuItem[] = [];
}
