import { Component, Input } from '@angular/core';
import { Timecard } from './timecard.model';
import { TimecardService } from './timecard.service';

@Component({
  selector: 'app-timecard',
  templateUrl: './timecard.component.html',
})
export class TimecardComponent {
  @Input() timecard: Timecard;

  private months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(private timecardService: TimecardService) {}

  formatDate(year: number, month: number | null, day: number | null): string {
    const parts = [];
    if (day) parts.push(String(day).padStart(2, '0'));
    if (month) parts.push(this.months[month - 1]);
    parts.push(year);
    return parts.join('/');
  }

  onEdit(timecard: Timecard) {
    this.timecardService.timecardSelectedEvent.next({timecard: {...timecard}, new: false});
  }
}
