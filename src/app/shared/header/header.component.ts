import { NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable } from 'rxjs';

import { SetTokenAction } from '@shared/model/redmine-config/store/actions/setToken.action';
import RedmineConfigState from '@shared/model/redmine-config/store/redmine-config.state';
import { LogoComponent } from '@shared/ui/logo/logo.component';

import { ThemeService } from '../../core/services/theme-service/theme.service';
import {
  ProjectGlobalSelectComponent,
} from '../../modules/projects/components/project-global-select/project-global-select.component';
import { ProjectsSelectComponent } from '../../modules/projects/components/projects-select/projects-select.component';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    ToolbarModule,
    AvatarModule,
    RouterLink,
    ProjectsSelectComponent,
    MenubarModule,
    ProjectGlobalSelectComponent,
    ButtonModule,
    SidebarModule,
    MenuModule,
    NgForOf,
    LogoComponent,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: 'header.component.scss',
})
export class HeaderComponent {
  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  private store = inject(Store);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  menuItems: MenuItem[] = [];
  additionalMenuItems: MenuItem[] = [];
  currentTheme?: string;

  isSignIn: boolean = false;

  constructor() {
    this.apiKey$.subscribe((key) => {
      this.isSignIn = !!key;

      if (key) {
        this.menuItems = [
          {
            label: 'Задачи',
            routerLink: '/issues',
          },
          {
            label: 'Доска',
            routerLink: '/issues/kanban',
          },
          {
            label: 'Трудозатраты',
            routerLink: '/time-entries',
          },
        ];

        this.additionalMenuItems = [
        ];
      }
      else {
        this.menuItems = [
          {
            label: 'Вход',
            routerLink: '/login',
            routerLinkActiveOptions: true,
          },
        ];
      }
    });
    this.themeService.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  isActiveRoute(url: string) {
    return this.router.isActive(url, true);
  }

  trackByLink(index: number, item: MenuItem) {
    return item.routerLink;
  }

  navigate(menuItem: MenuItem) {
    this.router.navigate([menuItem.routerLink]);
  }

  exit() {
    this.store.dispatch(new SetTokenAction(''));
    this.router.navigate(['/login']);
  }

  switchTheme() {
    this.themeService.switchTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }
}
