import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { find as fsFind } from '@firestitch/common';

import { StatusData } from '@app/core';
import { Status } from '@app/shared/interfaces';


@Component({
  selector: 'app-status-menu',
  templateUrl: './status-menu.component.html',
  styleUrls: ['./status-menu.component.scss']
})
export class StatusMenuComponent implements OnInit, OnDestroy {
  @Input() public width = '120px';

  @Input('status')
  set status(value: Status) {
    if (value) {
      this._status = value;
    }
  }

  get status(): Status {
      return this._status;
  }

  @Input() public class = '';
  @Input() public label = 'Status';

  @Input() public assignDefaultStatus = true;

  @Output() public statusChanged = new EventEmitter<Status>();

  public statuses: Status[] = null;

  private _status: Status = null;
  private _defaultStatus: Status = null;

  private _$destroy = new Subject();

  constructor(private _statusData: StatusData) { }

  public ngOnInit() {
    this._statusData.gets({ class: this.class })
      .pipe(
        takeUntil(this._$destroy)
      )
      .subscribe(response => {
        this.statuses = response;

        this._defaultStatus = fsFind(this.statuses, { default: 1 });
        if (!this._status && this.assignDefaultStatus) {
          this._status = this._defaultStatus;
        }
      });
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public changeStatus(status: Status) {
    this._status = status;
    this.statusChanged.emit(this.status);
  }

  public compareFn(statusOne: Status, statusTwo: Status ): boolean {
    return statusOne && statusTwo && statusOne.id === statusTwo.id;
  }
}
