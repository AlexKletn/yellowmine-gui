import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { SharedModule } from 'primeng/api';
import { SetSettingsKanban } from '../../store/issues.actions/SetSettingsKanban';
import { Select, Store } from '@ngxs/store';
import IssuesState from '../../store/issues.state';
import { combineLatestWith, Observable, take } from 'rxjs';
import { IssueStatus } from '../../../issue-statuses/domain/IssueStatus';
import IssueStatusesService from '../../../issue-statuses/service/issueStatuses.service';
import { ButtonModule } from 'primeng/button';
import RedmineConfigState from '../../../../core/services/redmine-config/store/redmine-config.state';

@Component({
  selector: 'rm-issues-kanban-columns-configurator',
  standalone: true,
  imports: [
    DialogModule,
    PickListModule,
    SharedModule,
    ButtonModule,
  ],
  templateUrl: './issues-kanban-columns-configurator.component.html',
  styleUrl: './issues-kanban-columns-configurator.component.scss',
})
export class IssuesKanbanColumnsConfiguratorComponent {
  isOpen: boolean = false;

  private store = inject(Store);
  private issueStatusesService = inject(IssueStatusesService);

  @Select(RedmineConfigState.apiKey)
  private apiKey$!: Observable<string>;

  @Select(IssuesState.activeIssueStatuses)
  activeIssueStatuses$!: Observable<IssueStatus[]>;

  activeIssueStatuses!: IssueStatus[];
  availableIssueStatuses!: IssueStatus[];

  constructor() {
    this.init();

    this.apiKey$.subscribe((key) => {
      if (key) {
        this.issueStatusesService.loadIssueStatuses();
        this.init();
      }
    });
  }

  ngOnInit() {
  }

  openHandler() {
    this.isOpen = true;
  }

  getTrackByStatusKey(index: unknown, { id }: IssueStatus) {
    return id;
  }

  moveStatusHandler() {
    this.store.dispatch(new SetSettingsKanban({
      activeIssueStatuses: [...this.activeIssueStatuses],
    }));
  }

  private init() {
    const issueStatuses$ = this.issueStatusesService.issueStatuses;

    this.activeIssueStatuses$.pipe(
      take(1),
      combineLatestWith(issueStatuses$),
    ).subscribe(([activeIssueStatuses, availableIssueStatuses]) => {
      this.activeIssueStatuses = [...(activeIssueStatuses)];

      this.availableIssueStatuses = (availableIssueStatuses.filter(({ id }) => {
        return !activeIssueStatuses.some(activeStatus => activeStatus.id === id);
      }));
    });
  }
}
