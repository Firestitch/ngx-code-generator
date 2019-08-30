import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouteObserver } from '@firestitch/core';
import { Account } from '@app/shared';


@Component({
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit, OnDestroy {

  public account: Account = { id: null, image: {} };
  public routeObserver = new RouteObserver(this._route.parent, 'account');

  constructor(private _route: ActivatedRoute) {}

  public ngOnInit() {
    this.routeObserver
      .subscribe(account => {
        this.account = account || {};
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }
}
