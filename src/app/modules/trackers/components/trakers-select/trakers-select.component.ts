import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tracker } from '../../domain/types';
import TrackerService from '../../service/trackers.service';
import { JsonPipe } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

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
    trackerService.trackers.subscribe((trackers) => {
      console.log(trackers);
      this.trackers = trackers;
    });
  }

  @Input() value!: Tracker['id'];
  @Output() onChanged = new EventEmitter<Tracker['id']>();
  change(newId: Tracker['id']) {
    console.log(newId);

    this.onChanged.emit(newId);
  }
}
