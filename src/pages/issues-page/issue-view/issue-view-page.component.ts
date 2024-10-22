import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { IssueViewComponent } from '@widgets/issues-group/issue-view/issue-view.component';

@Component({
  selector: 'ym-issue-view-page',
  standalone: true,
  imports: [
    IssueViewComponent,
  ],
  templateUrl: './issue-view-page.component.html',
  styleUrl: './issue-view-page.component.scss',
})
export class IssueViewPageComponent {
  private activeRoute = inject(ActivatedRoute);
  private params = toSignal<ParamMap>(this.activeRoute.paramMap);

  id = computed(() => this.params()!.get('id') as unknown as number);

  constructor() {
    console.log(this.id());
  }
}
