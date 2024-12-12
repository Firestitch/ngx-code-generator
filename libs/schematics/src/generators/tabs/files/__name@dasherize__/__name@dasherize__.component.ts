import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, Router, NavigationEnd<% if(routeObserver) { %>, ActivatedRoute<% } %> } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { FsTabsModule } from '@firestitch/tabs';<% if(routeObserver) { %>
import { RouteObserver } from '@firestitch/core';<% } %>

import { filter } from 'rxjs/operators';

import { NavService } from '@app/core';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,

    MatCardModule,
    MatTabsModule,

    FsTabsModule,
  ],
})
export class <%= classify(name) %>Component implements OnInit {

  public links: { path: string, label: string }[] = [];<%if (routeObserver) { %>
  public data: any;<% } %>

  private _navService = inject(NavService);
  private _router = inject(Router);
  private _cdRef = inject(ChangeDetectorRef);<% if(routeObserver) { %>
  private _route = inject(ActivatedRoute);
  private _routeObserver$ = new RouteObserver(this._route, 'data');<% } %>

  public ngOnInit(): void {<% if(titledComponent) { %>
    this._initNavigationEnd();<% } %><% if(routeObserver) { %>
    this._initRouteObserver();<% } %>
    this._setLinks();
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
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this._initTitle();

        this._cdRef.markForCheck();
      });
  }<% if(routeObserver) { %>

  private _initRouteObserver(): void {
    this._routeObserver$
      .pipe(
        takeUntilDestroyed(),
      )
      .subscribe((data) => {
        this.data = data;<% if(titledComponent) { %>
        this._initTitle();<% } %>

        this._cdRef.markForCheck();
      });
  }<% } %>

}
