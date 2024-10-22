import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

import { Tracker } from '../../domain/types';
import TrackerService from '../../service/trackers.service';

@Component({
  selector: 'rm-trakers-select',
  standalone: true,
  imports: [
    JsonPipe,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './trakers-select.component.html',
  styleUrl: './trakers-select.component.scss',
})
export class TrakersSelectComponent {
  trackers: Array<Tracker> = [];

  constructor(private trackerService: TrackerService) {
    this.trackerService.trackers.subscribe((trackers) => {
      this.trackers = trackers;
    });
  }

  @Input() value!: Tracker['id'];
  @Output() onChanged = new EventEmitter<Tracker['id']>();
  change(newId: Tracker['id']) {
    this.onChanged.emit(newId);
  }
}
