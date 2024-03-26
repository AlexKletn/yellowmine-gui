import { Routes } from '@angular/router';
import { ProjectsPageComponent } from './modules/projects/pages/projects-page/projects-page.component';
import { ProjectPageComponent } from './modules/projects/pages/project-page/project-page.component';
import { IssuesPageComponent } from './modules/issues/pages/issues-page/issues-page.component';
import { IssuePageComponent } from './modules/issues/pages/issue-page/issue-page.component';
import { IssueCreatePageComponent } from './modules/issues/pages/issue-create-page/issue-create-page.component';
import { IssuesKanbanPageComponent } from './modules/issues/pages/issues-kanban-page/issues-kanban-page.component';
import { LoginPageComponent } from './core/services/redmine-config/pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
  {
    path: 'projects',
    component: ProjectsPageComponent,
  },
  {
    path: 'projects/:id',
    component: ProjectPageComponent,
  },
  {
    path: 'issues',
    component: IssuesPageComponent,
  },
  {
    path: 'issues/kanban',
    component: IssuesKanbanPageComponent,
  },
  {
    path: 'issues/create',
    component: IssueCreatePageComponent,
  },
  {
    path: 'issues/:id',
    component: IssuePageComponent,
  },
];
