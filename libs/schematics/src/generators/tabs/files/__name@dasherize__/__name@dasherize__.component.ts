import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';<% if(routeObserver) { %>

import { RouteObserver } from '@firestitch/core';<% } %>

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NavService } from '@app/core';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public links: { path: string, label: string }[] = [];<%if (routeObserver) { %>
  public data: any;

  private _routeObserver$ = new RouteObserver(this._route, 'data');<% } %>
  private _destroy$ = new Subject();

  constructor(
    private _navService: NavService,
    private _router: Router,
    private _cdRef: ChangeDetectorRef,<% if(routeObserver) { %>
    private _route: ActivatedRoute,<% } %>
  ) {}

  public ngOnInit(): void {<% if(titledComponent) { %>
    this._initNavigationEnd();<% } %><% if(routeObserver) { %>
    this._initRouteObserver();<% } %>
    this._setLinks();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setLinks(): void {
    this.links = [
      {
        label: 'Path A',
        path: 'patha',
      },
      {
        label: 'Path B',
        path: 'pathb',
      },
    ];
  }

  private _initTitle(): void {
    this._navService.setTitle('Title');
    // if (this.data) {
    //   this._navService.setTitle('Title', this.data.name);
    // }
  }

  private _initNavigationEnd(): void  {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._initTitle();

        this._cdRef.markForCheck();
      });
  }<% if(routeObserver) { %>

  private _initRouteObserver(): void {
    this._routeObserver$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.data = data;<% if(titledComponent) { %>
        this._initTitle();<% } %>

        this._cdRef.markForCheck();
      });
  }<% } %>

}
