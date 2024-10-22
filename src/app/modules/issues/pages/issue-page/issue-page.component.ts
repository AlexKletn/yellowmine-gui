import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IssueViewComponent } from '../../components/issue-view/issue-view.component';

@Component({
  selector: 'rm-issue-page',
  standalone: true,
  imports: [
    IssueViewComponent,
    NgIf,
  ],
  templateUrl: './issue-page.component.html',
  styleUrl: './issue-page.component.scss',
})
export class IssuePageComponent {
  id!: number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(({ id }) => {
      this.id = id;
    });
  }
}
