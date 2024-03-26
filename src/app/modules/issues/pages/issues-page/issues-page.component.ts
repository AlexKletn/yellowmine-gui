import { Component } from '@angular/core';
import { IssuesListComponent } from '../../components/issues-list/issues-list.component';

@Component({
  selector: 'rm-issues-page',
  standalone: true,
  imports: [
    IssuesListComponent,
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss',
})
export class IssuesPageComponent {

}
