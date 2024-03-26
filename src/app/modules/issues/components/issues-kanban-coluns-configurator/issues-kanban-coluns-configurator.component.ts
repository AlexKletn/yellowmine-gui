import { Component, inject, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { SharedModule } from 'primeng/api';
import { SetSettingsKanban } from '../../store/issues.actions/SetSettingsKanban';
import { Select, Store } from '@ngxs/store';
import IssuesState from '../../store/issues.state';
import { combineLatestWith, Observable, take } from 'rxjs';
import { IssueStatus } from '../../../issue-statuses/domain/IssueStatus';
import IssueStatusesService from '../../../issue-statuses/service/issueStatuses.service';

@Component({
  selector: 'rm-issues-kanban-coluns-configurator',
  standalone: true,
  imports: [
    DialogModule,
    PickListModule,
    SharedModule,
  ],
  templateUrl: './issues-kanban-coluns-configurator.component.html',
  styleUrl: './issues-kanban-coluns-configurator.component.scss',
})
export class IssuesKanbanColunsConfiguratorComponent {
  @Input() isOpen: boolean = false;

  private store = inject(Store);
  private issueStatusesService = inject(IssueStatusesService);

  @Select(IssuesState.activeIssueStatuses)
  activeIssueStatuses$!: Observable<IssueStatus[]>;

  activeIssueStatuses!: IssueStatus[];
  availableIssueStatuses!: IssueStatus[];

  ngOnInit() {
    const issueStatuses$ = this.issueStatusesService.issueStatuses.pipe(take(1));

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

  getTrackByStatusKey(index: unknown, { id }: IssueStatus) {
    return id;
  }

  moveStatusHandler() {
    this.store.dispatch(new SetSettingsKanban({
      activeIssueStatuses: [...this.activeIssueStatuses],
    }));
  }
}
