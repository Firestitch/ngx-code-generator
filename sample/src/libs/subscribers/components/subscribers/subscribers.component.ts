import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { AccountData } from '@app/core';
import { Account } from '@app/shared/interfaces';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})

export class SubscribersComponent implements OnInit, OnDestroy {
  @Input() subscribers: Account[] = [];
  @Output() subscribersChange = new EventEmitter<Account[]>();
  @Output() onChanged = new EventEmitter<Account>();

  private _$destroy = new Subject();

  constructor(
    private _accountData: AccountData
  ) { }

  public fetch = keyword => {
    return this._accountData.gets({ keyword })
      .pipe(
        takeUntil(this._$destroy),
        map(response => response)
      );
  };

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public change(data) {
    this.subscribersChange.emit(this.subscribers);
    this.onChanged.emit(data);
  }

}
