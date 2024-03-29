import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NgxsFormPluginModule, UpdateFormDirty } from '@ngxs/form-plugin';
import { Store } from '@ngxs/store';

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

  private store = inject(Store);

  filterForm: FormGroup = new FormGroup({
    tag: new FormControl<string>('', {
      updateOn: 'blur',
    }),
    subject: new FormControl<string>('', {
      updateOn: 'blur',
    }),
    isMy: new FormControl<boolean>(false),
  });

  updateFilterTimeout?: ReturnType<typeof setTimeout>;

  filterChangeHandler() {
    if (this.updateFilterTimeout) {
      clearTimeout(this.updateFilterTimeout);
    }

    this.updateFilterTimeout = setTimeout(() => {
      this.store.dispatch(
        new UpdateFormDirty({
          dirty: false,
          path: 'issues.settings.kanbanFilters',
        }),
      );
    }, 500);
  }
}
