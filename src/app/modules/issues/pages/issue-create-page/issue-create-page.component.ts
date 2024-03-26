import { Component } from '@angular/core';
import { IssueCreateFormComponent } from '../../components/issue-create/issue-create-form.component';

@Component({
  selector: 'rm-issue-create-page',
  standalone: true,
  imports: [
    IssueCreateFormComponent,
  ],
  templateUrl: './issue-create-page.component.html',
  styleUrl: './issue-create-page.component.scss',
})
export class IssueCreatePageComponent {

}
