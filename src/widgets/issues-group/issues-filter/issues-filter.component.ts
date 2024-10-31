import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { IssuesService } from '@features/issues/issues.service';
import { ProjectsService } from '@features/projects';
import { RequestFilter } from '@shared/api/redmine-api/RequestFilter';

@Component({
  selector: 'ym-issues-filter',
  standalone: true,
  imports: [
    Select,
    MultiSelectModule,
    Drawer,
    ListboxModule,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    StyleClassModule,
    ButtonModule,
    ToggleButtonModule,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './issues-filter.component.html',
  styleUrl: './issues-filter.component.scss',
})
export class IssuesFilterComponent implements OnInit {
  @Input({ required: true }) filter!: RequestFilter;

  private issuesService = inject(IssuesService);
  private projectsService = inject(ProjectsService);
  private projectsFilter = new RequestFilter(0, 100);

  projects = this.projectsService.projects(this.projectsFilter);

  statuses = this.issuesService.statuses();

  types = this.issuesService.types();

  isAssignedToMe = signal(false);

  isDrawerOpened = false;

  constructor() {
    this.projectsFilter
      .setFilter('status_id', '*');

    effect(() => {
      if (this.isAssignedToMe()) {
        this.filter.setFilter('assigned_to_id', 'me');
      }
      else {
        this.filter.setFilter('assigned_to_id', '*');
      }
      this.filter.make();
    }, {
      allowSignalWrites: true,
    });
  }

  ngOnInit() {
  }

  setFilter(name: string, value: string | number) {
    this.filter.setFilter(name, value);
    this.filter.make();
  };

  openDrawer() {
    this.isDrawerOpened = true;
  }

  setAssignedToMe({ value }: SelectButtonChangeEvent) {
    if (typeof value !== 'undefined') {
      this.isAssignedToMe.set(value);
    }
  }
}
