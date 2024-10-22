import { Routes } from '@angular/router';

import { authGuard, dontAuthGuard } from '@shared/model/router-guards';
// import { dontLoginGuard, loginGuard } from './core/guards/loginGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Начальная настройка',
    loadComponent: () => import('@pages/login-page').then(m => m.LoginPageComponent),
    canActivate: [dontAuthGuard],
  },
  {
    path: 'projects',
    title: 'Проекты',
    loadComponent: () => import('@pages/projects-page').then(m => m.ProjectsPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'issues',
    title: 'Задачи',
    loadComponent: () => import('@pages/issues-page').then(m => m.IssuesPageComponent),
    canActivate: [authGuard],

    children: [
      {
        path: ':id',
        loadComponent: () => import('@pages/issues-page').then(m => m.IssueViewPageComponent),
      },
    ],
  },
  // {
  //   path: 'issues/kanban',
  //   title: 'Доска задач',
  //   loadComponent: () => import('./modules/issues/pages/issues-kanban-page/issues-kanban-page.component').then(m => m.IssuesKanbanPageComponent),
  //   canActivate: [loginGuard],
  // },
  // {
  //   path: 'issues/create',
  //   title: 'Создание задач',
  //   loadComponent: () => import('./modules/issues/pages/issue-create-page/issue-create-page.component').then(m => m.IssueCreatePageComponent),
  //   canActivate: [loginGuard],
  // },
  // {
  //   path: 'issues/:id',
  //   loadComponent: () => import('./modules/issues/pages/issues-page/issues-page.component').then(m => m.IssuesPageComponent),
  //   canActivate: [loginGuard],
  // },
  // {
  //   path: 'time-entries',
  //   title: 'Трудозатраты',
  //   loadComponent: () => import('./modules/time-entries/pages/time-entries-page/time-entries-page.component').then(m => m.TimeEntriesPageComponent),
  //   canActivate: [loginGuard],
  // },
];
