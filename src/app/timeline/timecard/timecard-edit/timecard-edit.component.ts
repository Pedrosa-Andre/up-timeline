import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Timecard } from '../timecard.model';
import { TimecardService } from '../timecard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timecard-edit',
  templateUrl: './timecard-edit.component.html',
  styleUrls: ['./timecard-edit.component.css'],
})
export class TimecardEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') form: NgForm;
  @Output() cancel = new EventEmitter<void>();
  @Input() timecard = new Timecard(0, '', '', 0, null, null, null, null, null);
  @Input() newTimecard = false;
  private subscription: Subscription;

  constructor(private timecardService: TimecardService) {}

  ngOnInit(): void {
    this.subscription = this.timecardService.timecardSelectedEvent.subscribe(
      (data) => {
        this.timecard = data.timecard;
        this.newTimecard = data.new;
      }
    );
  }

  onSave(): void {
    const value = this.form.value;
    const newTimecard = new Timecard(
      0,
      value.title,
      value.description,
      value.yearStart,
      value.monthStart,
      value.dayStart,
      value.yearEnd,
      value.monthEnd,
      value.dayEnd
    );
    if (this.newTimecard) {
      this.timecardService.addTimecard(newTimecard);
    } else {
      this.timecardService.updateTimecard(this.timecard, newTimecard);
    }
    this.cancel.emit();
  }

  onDelete(): void {
    this.timecardService.deleteTimecard(this.timecard);
    this.cancel.emit();
  }

  onClose(): void {
    this.cancel.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
