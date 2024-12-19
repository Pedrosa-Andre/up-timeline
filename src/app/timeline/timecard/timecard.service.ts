import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Timecard } from './timecard.model';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimecardService {
  timecards: Timecard[] = [];
  timecardSelectedEvent = new BehaviorSubject<{timecard: Timecard | null, new: boolean}>({timecard: null, new: false});
  timecardChangedEvent = new Subject<Timecard[]>();
  maxTimecardId: number;

  constructor(private http: HttpClient) {
    this.getTimecards();
  }

  getTimecards(): Timecard[] {
    this.http.get('http://localhost:3000/timecards').subscribe(
      (responseData: {
        resMessage: string;
        timecards?: Timecard[];
        error?: string;
      }) => {
        this.timecards = responseData.timecards || [];
        const ids = this.timecards.map((timecard) => timecard.id);
        this.maxTimecardId = Math.max(...ids, 0);
        this.timecardChangedEvent.next(this.timecards.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
    return this.timecards.slice();
  }

  getTimecard(id: number): Timecard {
    const timecard = this.timecards.find((timecard) => timecard.id === id);
    return timecard;
  }

  deleteTimecard(timecard: Timecard) {
    if (!timecard) {
      return;
    }

    this.http.delete(`http://localhost:3000/timecards/${timecard.id}`).subscribe(
      () => {
        // Remove from local cache only on success
        this.timecards = this.timecards.filter((doc) => doc.id !== timecard.id);
        this.timecardChangedEvent.next(this.timecards.slice());
        console.log('Timecard deleted successfully');
      },
      (error: any) => {
        console.error('Error deleting timecard', error);
      }
    );
  }

  addTimecard(newTimecard: Timecard) {
    if (!newTimecard) {
      return;
    }

    this.maxTimecardId++;
    const timecardToAdd = { ...newTimecard, id: this.maxTimecardId };

    this.http.post('http://localhost:3000/timecards', timecardToAdd).subscribe(
      (responseData: {
        resMessage: string;
        timecard?: Timecard;
        error?: string;
      }) => {
        this.timecards.push(responseData.timecard!);
        this.timecardChangedEvent.next(this.timecards.slice());
      },
      (error: any) => {
        console.error('Error adding timecard', error);
      }
    );
  }

  updateTimecard(originalTimecard: Timecard, newTimecard: Timecard) {
    if (!originalTimecard || !newTimecard) {
      return;
    }

    newTimecard.id = originalTimecard.id;

    this.http
      .put(
        `http://localhost:3000/timecards/${originalTimecard.id}`,
        newTimecard
      )
      .subscribe(
        (responseData: {
          resMessage: string;
          timecard?: Timecard;
          error?: string;
        }) => {
          const pos = this.timecards.findIndex(
            (doc) => doc.id === originalTimecard.id
          );
          if (pos >= 0) {
            this.timecards[pos] = responseData.timecard!;
            this.timecardChangedEvent.next(this.timecards.slice());
          }
        },
        (error: any) => {
          console.error('Error updating timecard', error);
        }
      );
  }
}
