import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Ripple } from 'primeng/ripple';

import { RedmineConfigService } from '@shared/model/redmine-config';
import { RouterToolsService } from '@shared/model/router-tools/router-tools.service';
import { LogoComponent } from '@shared/ui/logo/logo.component';
import { ActiveIssuesComponent } from '@widgets/issues-group/active-issues/active-issues.component';

type MenuItem = {
  label: string;
  routerLink: string;

  children?: MenuItem[];
};

@Component({
  selector: 'ym-header',
  standalone: true,
  imports: [
    ButtonModule,
    LogoComponent,
    Ripple,
    RouterLink,
    ChipModule,
    NgClass,
    ActiveIssuesComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private routerTools = inject(RouterToolsService);
  private redmineConfig = inject(RedmineConfigService);
  private router = inject(Router);

  isAuth = this.redmineConfig.isAuth;

  authorizedMenu: MenuItem[] = [
    {
      label: 'Проекты',
      routerLink: '/projects',
    },
    {
      label: 'Задачи',
      routerLink: '/issues',

      children: [
        {
          label: 'Список',
          routerLink: '',
        },
        {
          label: 'Доска',
          routerLink: 'board',
        },
      ],
    },
    {
      label: 'Трудозатраты',
      routerLink: '/time-entries',
    },
  ];

  unAuthMenu = [
    {
      label: 'Начальная настройка',
      routerLink: '/login',
    },
  ];

  menu = computed<MenuItem[]>(
    () => this.isAuth() ? this.authorizedMenu : this.unAuthMenu,
  );

  logout() {
    this.redmineConfig.logout();
    this.router.navigate(['/']);
  }

  isActiveRoute(url: string, s?: boolean) {
    return this.routerTools.isActive(url, s);
  };
}
