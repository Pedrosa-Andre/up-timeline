import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TimecardService } from './timecard/timecard.service';
import { Timecard } from './timecard/timecard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  timecards: Timecard[];
  @Input() isModalVisible = false;
  private subscriptionChange: Subscription;
  private subscriptionSelect: Subscription;

  constructor(private timecardService: TimecardService) {}

  sortTimecards(timecards: Timecard[]): Timecard[] {
    return timecards.sort((a, b) => {
      if (a.yearStart !== b.yearStart) {
        return a.yearStart - b.yearStart;
      }
      if ((a.monthStart || 0) !== (b.monthStart || 0)) {
        return (a.monthStart || 0) - (b.monthStart || 0);
      }
      return (a.dayStart || 0) - (b.dayStart || 0);
    });
  }

  ngOnInit(): void {
    this.subscriptionChange =
      this.timecardService.timecardChangedEvent.subscribe((timecards) => {
        this.timecards = this.sortTimecards(timecards);
      });
    this.subscriptionSelect =
      this.timecardService.timecardSelectedEvent.subscribe((data) => {
        this.isModalVisible = !!data.timecard;
      });
  }

  closeEditModal() {
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.subscriptionChange.unsubscribe();
    this.subscriptionSelect.unsubscribe();
  }

  onNew() {
    const timecard = new Timecard(0, '', '', 0, null, null, null, null, null);
    this.timecardService.timecardSelectedEvent.next({
      timecard: timecard,
      new: true,
    });
  }
}
