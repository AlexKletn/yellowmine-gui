import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TrakersSelectComponent } from '../../../trackers/components/trakers-select/trakers-select.component';
import { ProjectsSelectComponent } from '../../../projects/components/projects-select/projects-select.component';

@Component({
  selector: 'rm-issue-create-form',
  standalone: true,
  imports: [
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    FloatLabelModule,
    TrakersSelectComponent,
    ProjectsSelectComponent,
  ],
  templateUrl: './issue-create-form.component.html',
  styleUrl: './issue-create-form.component.scss',
})
export class IssueCreateFormComponent {

}
