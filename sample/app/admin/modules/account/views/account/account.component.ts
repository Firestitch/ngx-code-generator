import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { RouteObserver } from '@firestitch/core';

import { AccountData, NavService } from '@app/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  public account: Account = { id: null, image: {} };
  public navItems = [
    { path: '.', label: 'OVERVIEW' },
    { path: 'roles', label: 'ROLES' },
    { path: 'audits', label: 'AUDITS' }
  ];

  public routeObserver = new RouteObserver(this._route, 'account');

  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _navService: NavService,
    private _accountData: AccountData
  ) {}

  public ngOnInit() {

    this._navService.routeChange
       .pipe(takeUntil(this._destroy$))
       .subscribe(() => this.setTitle());

    this.routeObserver
      .subscribe(account => {
        this.account = this._accountData.create(account);
        this.setTitle();
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setDetailTitle(
      'Admin',
      'Account',
      this.account.id,
      this.account.name,
      this.account.image.small);
  }
}
