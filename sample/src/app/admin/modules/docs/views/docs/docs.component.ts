import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavService } from '@app/core';


@Component({
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit, OnDestroy {

  public navLinks = [];

  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this.init();

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this.init());

    this.navLinks = [
      {
        path: ['/admin', 'docs', 'types'],
        label: 'TYPES'
      },
      {
        path: 'statuses',
        label: 'STATUSES'
      }
    ];
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private init() {
    this._navService.setListTitle('Admin', 'Docs');
  }

}
