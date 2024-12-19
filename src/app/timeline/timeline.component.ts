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

  ngOnInit(): void {
    this.subscriptionChange =
      this.timecardService.timecardChangedEvent.subscribe((timecards) => {
        this.timecards = timecards;
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
