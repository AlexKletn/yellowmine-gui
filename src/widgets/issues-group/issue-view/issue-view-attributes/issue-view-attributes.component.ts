import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import Issue from '@entities/issues/model/types';

@Component({
  selector: 'ym-issue-view-attributes',
  standalone: true,
  imports: [
    DatePipe,
  ],
  templateUrl: './issue-view-attributes.component.html',
  styleUrl: './issue-view-attributes.component.scss',
})
export class IssueViewAttributesComponent {
  @Input({ required: true }) issue!: Issue;
}
