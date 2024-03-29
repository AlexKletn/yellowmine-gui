import { Routes } from '@angular/router';
import { dontLoginGuard, loginGuard } from './core/guards/loginGuard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/services/redmine-config/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
    canActivate: [dontLoginGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./core/services/redmine-config/pages/login-page/login-page.component').then(m => m.LoginPageComponent),
    canActivate: [dontLoginGuard],
  },
  {
    path: 'projects',
    loadComponent: () => import('./modules/projects/pages/projects-page/projects-page.component').then(m => m.ProjectsPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./modules/projects/pages/project-page/project-page.component').then(m => m.ProjectPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues',
    loadComponent: () => import('./modules/issues/pages/issues-page/issues-page.component').then(m => m.IssuesPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/kanban',
    loadComponent: () => import('./modules/issues/pages/issues-kanban-page/issues-kanban-page.component').then(m => m.IssuesKanbanPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/create',
    loadComponent: () => import('./modules/issues/pages/issue-create-page/issue-create-page.component').then(m => m.IssueCreatePageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'issues/:id',
    loadComponent: () => import('./modules/issues/pages/issue-page/issue-page.component').then(m => m.IssuePageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'time-entries',
    loadComponent: () => import('./modules/time-entries/pages/time-entries-page/time-entries-page.component').then(m => m.TimeEntriesPageComponent),
    canActivate: [loginGuard],
  },
];
