import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteObserver } from '@firestitch/core';

import { AccountData } from '@app/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  public account: Account = null;
  public routeObserver = new RouteObserver(this._route.parent, 'account');

  constructor(
    private _route: ActivatedRoute,
    private _accountData: AccountData,
    private _router: Router
  ) { }

  public ngOnInit() {
    this.routeObserver
      .subscribe(account => {
        this.account = this._accountData.create(account);
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

  public save(account: Account) {

    if (!this.account.id) {
      this._router.navigate([account.id], { relativeTo: this._route });
    }

    this.routeObserver.next(account);
  }

}
