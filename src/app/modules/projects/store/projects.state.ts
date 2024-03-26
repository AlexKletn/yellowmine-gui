import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ProjectsStoreState } from './types';
import { SetActiveProject, SetProjects } from './projects.actions';
import { SetTags } from './projects.actions/set-tags';

type ProjectsStateContext = StateContext<ProjectsStoreState>;

@State<ProjectsStoreState>({
  name: 'projects',
  defaults: {
    items: [],
    tags: [],
    activeProject: undefined,
  },
})
@Injectable()
export default class ProjectsState {
  @Selector()
  static activeProject(state: ProjectsStoreState) {
    return state.activeProject;
  }

  @Action(SetProjects)
  setProjects(ctx: ProjectsStateContext, action: SetProjects) {
    ctx.setState({
      ...ctx.getState(),

      items: action.items,
    });
  }

  @Action(SetActiveProject)
  setActiveProject(ctx: ProjectsStateContext, action: SetActiveProject) {
    ctx.setState({
      ...ctx.getState(),

      activeProject: action.activeProject,
    });
  }

  @Action(SetTags)
  setTags(ctx: ProjectsStateContext, action: SetTags) {
    ctx.setState({
      ...ctx.getState(),

      tags: action.tags,
    });
  }
}
