import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { IssueJournal } from '@entities/issues/model/types';
import { IssuesService } from '@features/issues/issues.service';
import Textile from '@shared/lib/textile/textileParser';
import { TextileViewComponent } from '@shared/ui/textile-view/textile-view.component';
import {
  IssueViewAttributesComponent,
} from '@widgets/issues-group/issue-view/issue-view-attributes/issue-view-attributes.component';
import { ToggleSidebarAction } from '@widgets/issues-group/issue-view/issue-view-store/actions/toggle-sidebar.action';
import { IssueViewState } from '@widgets/issues-group/issue-view/issue-view-store/issue-view.state';

import { IssueViewAttachmentsComponent } from './issue-view-attachments/issue-view-attachments.component';

@Component({
  selector: 'ym-issue-view',
  standalone: true,
  imports: [
    CardModule,
    AsyncPipe,
    TextileViewComponent,
    ScrollPanelModule,
    ButtonModule,
    DatePipe,
    ProgressSpinnerModule,
    IssueViewAttachmentsComponent,
    IssueViewAttributesComponent,
    NgClass,
  ],
  templateUrl: './issue-view.component.html',
  styleUrl: './issue-view.component.scss',
})
export class IssueViewComponent {
  private store = inject(Store);
  private textile = inject(Textile);

  id = input<number>(-1);

  private issuesService = inject(IssuesService);

  isLoading = signal(false);

  issue = this.issuesService.issue(this.id, this.isLoading);
  issueDescription = signal('');

  issueComments = signal<IssueJournal[]>([]);

  sidebarHidden = toSignal(
    this.store.select(IssueViewState.sidebarHidden),
  );

  hideIcon = computed(() => !this.sidebarHidden() ? 'pi pi-arrow-circle-right' : 'pi pi-arrow-circle-left');

  constructor() {
    effect(async () => {
      if (this.issue()) {
        this.parseDescription();

        const journals: IssueJournal[] = this.issue()?.journals.filter(({ notes }) => !!notes) ?? [];

        for (const journal of journals) {
          journal.notes = await this.textileParse(journal.notes);
        }

        this.issueComments.set(journals);
      }
    }, {
      allowSignalWrites: true,
    });
  }

  toggleSidebarHidden() {
    this.store.dispatch(new ToggleSidebarAction());
  }

  public async textileParse(input: string) {
    return await this.textile.parse(input, this.issue()!.attachments) ?? '';
  }

  private async parseDescription() {
    const description = await this.textile.parse(this.issue()!.description, this.issue()!.attachments);
    this.issueDescription.set(description);
  }

  protected readonly onabort = onabort;
}
