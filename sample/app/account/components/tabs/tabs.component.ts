import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { RouteObserver } from '@firestitch/core';

import { AccountData, AuthService, NavService } from '@app/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {

  public account: Account = null;
  public navItems = [
    { path: 'overview', label: 'OVERVIEW' },
    { path: 'notifications', label: 'NOTIFICATIONS' }
  ];

  public routeObserver = new RouteObserver(this._route, 'account');

  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _accountData: AccountData,
    private _navService: NavService,
    private _authService: AuthService
  ) {}

  public ngOnInit() {

    this._navService.routeChange.subscribe(() => {
      this.setTitle();
    });

    this._authService.loggedInAccount$
      .pipe(takeUntil(this._destroy$))
      .subscribe(data => {
        this.account = this._accountData.create(data.value);
        this.setTitle();
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setTitle(this.account.name);
    this._navService.setComponent('image', this.account.image.small, true);
  }
}
