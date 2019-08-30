import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountData, AuthService, SessionService } from '@app/core';
import { Account } from '../../../shared/interfaces';


@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  public account: Account = null;

  private _destroy$ = new Subject();

  constructor(
    private _accountData: AccountData,
    private _authService: AuthService,
    private _sessionService: SessionService
  ) {}

  public ngOnInit() {

    this._authService.loggedInAccount$
    .pipe(takeUntil(this._destroy$))
    .subscribe(data => {

      this._accountData.get(data.value.id)
      .subscribe(account => {
        this.account = account;
      });
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save(account: Account) {
    this._sessionService.account(account);
  }
}
