import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/internal/operators';

import { RouteObserver } from '@firestitch/core';

import { Type } from '@app/shared';
import { NavService } from '@app/core';


@Component({
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy {

  public type: Type = null;

  public navLinks = [];

  public routeObserver = new RouteObserver(this._route, 'type');

  private _destroy$ = new EventEmitter();

  constructor(
    private _route: ActivatedRoute,
    private _navService: NavService,
  ) { }

  public ngOnInit() {

    this.type = this._route.snapshot.data.type;

    this._navService.routeChange
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.setTitle();
      });

    this.routeObserver
      .subscribe(type => {
        this.type = type;
        this.setTitle();

        this.navLinks = [
          {
            path: ['/admin', 'docs', 'type', this.type.id],
            label: 'SETTINGS'
          },
          {
            path: ['/admin', 'docs', 'type', this.type.id, 'fields'],
            label: 'FIELDS'
          }
        ];

      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setDetailTitle('Admin', 'Doc Type', this.type.id, this.type.name);
  }

}
