import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Observable, of, interval } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, filter, map, startWith } from 'rxjs/operators';

import { FsStore } from '@firestitch/store';
import { date } from '@firestitch/date';

import { differenceInSeconds, differenceInMilliseconds, differenceInHours, format } from 'date-fns';

import { MultiWindowService, Message } from 'ngx-multi-window';
import { forEach } from 'lodash-es';

import { SessionService } from '@app/core/services/session.service';
import { State, } from '@app/shared/enums';
import { TimeEntryData } from '../data/time-entry.data';
import { TimeEntry, Timer } from '../interfaces';
import { TimeEntryType, TimeEntryState } from '../enums';


@Injectable()
export class TimerService {

  public timer$: Observable<Timer> = null;

  public timeEntryChange$ = new Subject<TimeEntry>();

  private _untrackedDuration = 60;

  private _stop$ = new Subject();

  private _originTitle = null;

  private _activeWindows: object[] = [];

  private _EVENT_START = 'start';
  private _EVENT_STOP = 'stop';
  private _EVENT_RESTART = 'restart';

  constructor(
    private _store: FsStore,
    private _timeEntryData: TimeEntryData,
    private _sessionService: SessionService,
    private _title: Title,
    private _multiWindowService: MultiWindowService
  ) {
    this._originTitle = this._title.getTitle();

    this.timer$ = this._store.observe('timer')
    .pipe(map(response => {
      return response && response.value ? response.value : null;
    }));

    this._multiWindowService.onMessage()
      .subscribe((value: Message) => {
        switch (value.event) {
          case this._EVENT_START:
            this.start(value.data, false).subscribe(() => { });
            break;
          case this._EVENT_STOP:
            this.stop(value.data, false).subscribe(() => { });
            break;
          case this._EVENT_RESTART:
            this.restart(value.data, false).subscribe(() => { });
            break;
        }
      });

    this._multiWindowService.onWindows()
      .subscribe(response => this._activeWindows = response);

    this.timer$
      .pipe(
        filter(response => !response)
      )
      .subscribe(() => this._stop$.next());

    this._store.observe('account')
      .subscribe(store => {
        if (store && store.value) {
          this.getRunningTimer()
            .pipe(
              filter(response => !!response)
            )
            .subscribe((response: Timer) => {
              this.start(response.time_entry, false).subscribe(() => { });
            });
        } else {
          // If session expired:
          // 1. Stop timer but don't cleat storage
          // 2. Inform another tabs about stop action
          this.stop().subscribe(() => {  });
        }
      });
  }

  public start(data: TimeEntry = null, messageWindows = true) {

    // Stop running timer if exist
    this._stop$.next();

    return Observable.create(observer => {

      if (data.id) {
        observer.next(data);
        observer.complete();
        return;
      }

      this.saveTimeEntry(Object.assign({
        type: TimeEntryType.Timer,
        state: TimeEntryState.Running,
        start_date: (new Date()).toISOString()
      }, data))
        .subscribe(response => {
          observer.next(Object.assign(data, response));
          observer.complete();
        });

    })
    .pipe(
      map((timeEntry: TimeEntry) => {
        interval(1000).pipe(
          startWith(differenceInMilliseconds(new Date(), date(timeEntry.start_date))),
          takeUntil(this._stop$)
        )
        .subscribe(() => {
          const timer = this.buildTimer(timeEntry);
          this._sessionService.timer(timer);
          this.setTitle(timer);
        });

        if (messageWindows) {
          this.messageWindows(this._EVENT_START, timeEntry);
        }

        return timeEntry;
      })
    );
  }

  public stop(data: TimeEntry = null, messageWindows = true): Observable<TimeEntry> {

    return Observable.create(observer => {

      if (!data || data.state !== TimeEntryState.Running) {
        observer.next(data);
        observer.complete();
        return;
      }
      const endDate = new Date();

      return this.saveTimeEntry(Object.assign(data, {
        end_date: endDate.toISOString(),
        // Delete entry less than specified time
        state: differenceInSeconds(endDate, date(data.start_date)) <= this._untrackedDuration ?
          State.Deleted : State.Active
      }))
        .subscribe(response => {
          observer.next(response);
          observer.complete();
        });

    })
      .pipe(
        map((timeEntry: TimeEntry) => {
          this._store.set('timer', null);
          this.resetTitle();

          if (messageWindows) {
            this.messageWindows(this._EVENT_STOP, timeEntry);
          }
          return timeEntry;
        })
      );
  }

  public restart(data: TimeEntry, messageWindows = true) {

    if (data.state !== TimeEntryState.Running) {
      return of(null);
    }

    // Don't need to clear all. Start function going to kill active process
    // this.fsStore.set('timer', null);

    return this.start(data, false)
      .pipe(
        map(response => {
          if (messageWindows) {
            this.messageWindows(this._EVENT_RESTART, data);
          }
          return response;
        })
      );
  }

  public getRunningTimer(serverSync = true): Observable<Timer> {

    let timer = this._sessionService.timer();

    if (timer) {
      return of(timer);
    }

    if (!serverSync) {
      return null;
    }

    return this._timeEntryData.gets({
      type: TimeEntryType.Timer,
      state: TimeEntryState.Running,
      tasks: true
    })
    .pipe(
      map(response => {
        const timeEntry = response.length ? response[0] : null;
        if (timeEntry) {
          timer = this.buildTimer(timeEntry);
          this._sessionService.timer(timer);
          return timer;
        }

        return null;
      })
    );
  }

  public buildTimer(data: TimeEntry = null): Timer {

    const durationSeconds = differenceInSeconds(new Date(), date(data.start_date));
    const durationHours = differenceInHours(new Date(), date(data.start_date));

    return {
      time_entry: data,
      formatted_time: `${durationHours < 10 ? '0' : ''}${durationHours}${format(new Date(durationSeconds * 1000), ':mm:ss')}`,
      duration: durationSeconds
    };
  }

  public saveTimeEntry(data: TimeEntry) {
    return this._timeEntryData.save(data)
      .pipe(
        map(response => {
          this.timeEntryChange$.next(response);
          return response;
        })
      );
  }

  private setTitle(timer: Timer) {
    if (timer) {
      this._title.setTitle(`${timer.formatted_time} ${this._originTitle}`);
    }
  }

  private resetTitle() {
    this._title.setTitle(this._originTitle);
  }

  private messageWindows(event, timeEntry: TimeEntry) {

    forEach(this._activeWindows, window => {
      // Exclude current window
      if (this._multiWindowService.id === window.id) {
        return;
      }

      this._multiWindowService.sendMessage(window.id, event, timeEntry)
        .subscribe(
          (messageId: string) => {
            // console.log('Message send, ID is ' + messageId);
          },
          error => { },
          () => { }
        );
    });
  }

}
