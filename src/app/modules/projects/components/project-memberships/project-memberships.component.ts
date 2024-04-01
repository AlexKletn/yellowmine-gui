import { Component, forwardRef, inject } from '@angular/core';
import ProjectMembershipsService from '../../services/project-memberships.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { Membership } from '../../domain/Membership';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type MembershipValue = Membership['user']['id'][];

@Component({
  selector: 'rm-project-memberships',
  standalone: true,
  imports: [
    MultiSelectModule,
    FormsModule,
  ],
  providers: [
    ProjectMembershipsService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectMembershipsComponent),
      multi: true,
    },
  ],
  templateUrl: './project-memberships.component.html',
  styleUrl: './project-memberships.component.scss',
})
export class ProjectMembershipsComponent implements ControlValueAccessor {
  private membershipsService = inject(ProjectMembershipsService);

  memberships: Membership[] = [];

  private _value: MembershipValue = [];
  private onChange?: (arr: MembershipValue) => void;

  disabled: boolean = false;

  constructor() {
    this.membershipsService.memberships$.subscribe((m) => {
      this.memberships = m;
    });
  }

  get value(): MembershipValue {
    return this._value;
  }

  set value(value: MembershipValue) {
    if (this.onChange)
      this.onChange(value);

    this._value = value;
  }

  writeValue(value: MembershipValue): void {
    this.value = value;
  }

  registerOnChange(fn: (arr: MembershipValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
