import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'ym-time-entries-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    TagModule,
  ],
  templateUrl: './time-entries-calendar.component.html',
  styleUrl: './time-entries-calendar.component.scss',
})
export class TimeEntriesCalendarComponent {

}
