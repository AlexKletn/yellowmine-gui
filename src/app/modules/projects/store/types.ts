import Project from '../domain/Project';
import { Membership } from '../domain/Membership';

export interface ProjectsStoreState {
  items: Array<Project>;
  tags: Array<string>;
  activeProject?: Project['id'];
  memberships: Membership[];
}
