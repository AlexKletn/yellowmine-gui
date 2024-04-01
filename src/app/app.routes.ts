import { Routes } from '@angular/router';
import { dontLoginGuard, loginGuard } from './core/guards/loginGuard';

export const routes: Routes = [
  {
    path: '',
    title: 'Вход',
    loadComponent: () => import('./core/services/redmine-config/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
    canActivate: [dontLoginGuard, loginGuard],
  },
  {
    path: 'login',
    title: 'Вход',
    loadComponent: () => import('./core/services/redmine-config/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
    canActivate: [dontLoginGuard],
  },
  {
    path: 'projects',
    title: 'Проекты',
    loadComponent: () => import('./modules/projects/pages/projects-page/projects-page.component').then(m => m.ProjectsPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues',
    title: 'Задачи',
    loadComponent: () => import('./modules/issues/pages/issues-page/issues-page.component').then(m => m.IssuesPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/kanban',
    title: 'Доска задач',
    loadComponent: () => import('./modules/issues/pages/issues-kanban-page/issues-kanban-page.component').then(m => m.IssuesKanbanPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/create',
    title: 'Создание задач',
    loadComponent: () => import('./modules/issues/pages/issue-create-page/issue-create-page.component').then(m => m.IssueCreatePageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/:id',
    loadComponent: () => import('./modules/issues/pages/issues-page/issues-page.component').then(m => m.IssuesPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'time-entries',
    title: 'Трудозатраты',
    loadComponent: () => import('./modules/time-entries/pages/time-entries-page/time-entries-page.component').then(m => m.TimeEntriesPageComponent),
    canActivate: [loginGuard],
  },
];
