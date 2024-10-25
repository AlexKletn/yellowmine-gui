import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { filesize } from 'filesize';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { firstValueFrom } from 'rxjs';

import { Attachment } from '@entities/attachment/types';
import { IssueJournal } from '@entities/issues/model/types';
import { IssuesService } from '@features/issues/issues.service';
import { RedmineApi } from '@shared/api/redmine-api';
import saveFileToDevice from '@shared/lib/saveFileToDevice';
import Textile from '@shared/lib/textile/textileParser';
import { TextileViewComponent } from '@shared/ui/textile-view/textile-view.component';

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
  ],
  templateUrl: './issue-view.component.html',
  styleUrl: './issue-view.component.scss',
})
export class IssueViewComponent {
  private redmineApi = inject(RedmineApi);
  private textile = inject(Textile);

  id = input<number>(-1);

  private issuesService = inject(IssuesService);

  isLoading = signal(false);

  issue = this.issuesService.issue(this.id, this.isLoading);
  issueDescription = signal('');

  issueComments = signal<IssueJournal[]>([]);

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

  public fileSizeParser(size: number) {
    return filesize(size);
  }

  public async download(attachment: Attachment) {
    const fileBuffer = await firstValueFrom(
      this.redmineApi.get(
        `/redmine/attachments/download/${attachment!.id}/${attachment!.filename}`,
        {
          responseType: 'arraybuffer',
        },
      ),
    );

    saveFileToDevice(new File([fileBuffer], attachment.filename));
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
