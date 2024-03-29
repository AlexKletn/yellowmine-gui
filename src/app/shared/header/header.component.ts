import { Component, inject } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterLink } from '@angular/router';
import { ProjectsSelectComponent } from '../../modules/projects/components/projects-select/projects-select.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import {
  ProjectGlobalSelectComponent,
} from '../../modules/projects/components/project-global-select/project-global-select.component';
import { Select, Store } from '@ngxs/store';
import RedmineConfigState from '../../core/services/redmine-config/store/redmine-config.state';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { NgForOf, NgIf } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { SetTokenAction } from '../../core/services/redmine-config/store/actions/setToken.action';
import { ThemeService } from '../../core/services/theme-service/theme.service';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [ToolbarModule, AvatarModule, RouterLink, ProjectsSelectComponent, MenubarModule, ProjectGlobalSelectComponent, ButtonModule, SidebarModule, MenuModule, NgForOf, LogoComponent, NgIf],
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
          // {
          //   label: 'Вики',
          //   routerLink: '/wiki',
          // },
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

  ngAfterViewInit() {
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
