import { Component, inject, Input } from '@angular/core';
import { filesize } from 'filesize';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';

import { Attachment } from '@entities/attachment/types';
import { RedmineApi } from '@shared/api/redmine-api';
import saveFileToDevice from '@shared/lib/saveFileToDevice';

@Component({
  selector: 'ym-issue-view-attachments',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './issue-view-attachments.component.html',
  styleUrl: './issue-view-attachments.component.scss',
})
export class IssueViewAttachmentsComponent {
  @Input() attachments?: Attachment[];

  private redmineApi = inject(RedmineApi);

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
}
