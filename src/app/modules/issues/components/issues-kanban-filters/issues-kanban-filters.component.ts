import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

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
  });
}
