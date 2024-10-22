import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';

import {
  ProjectMembershipsComponent,
} from '../../../projects/components/project-memberships/project-memberships.component';
import { Membership } from '../../../projects/domain/Membership';

@Component({
  selector: 'rm-issues-kanban-filters',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToggleButtonModule,
    NgTemplateOutlet,
    NgxsFormPluginModule,
    NgClass,
    ProjectMembershipsComponent,
    NgIf,
  ],
  templateUrl: './issues-kanban-filters.component.html',
  styleUrl: './issues-kanban-filters.component.scss',
})
export class IssuesKanbanFiltersComponent {
  @Input() loading!: boolean;
  @Input() static!: boolean;

  filterForm: FormGroup = new FormGroup({
    tag: new FormControl<string>('', {}),
    subject: new FormControl<string>('', {}),
    isMy: new FormControl<boolean>(false),
    assignedTo: new FormControl<Membership['user']['id'][]>([], {}),
  });

  constructor() {
    this.filterForm.valueChanges.subscribe(({ isMy }) => {
      const assignedToDisabled = this.filterForm.controls['assignedTo'].disabled;

      if (isMy && !assignedToDisabled) {
        this.filterForm.controls['assignedTo'].disable();
      }

      if (assignedToDisabled && !isMy) {
        this.filterForm.controls['assignedTo'].enable();
      }
    });
  }
}
