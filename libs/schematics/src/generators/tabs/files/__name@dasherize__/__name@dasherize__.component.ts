import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, Router, NavigationEnd<% if(routeObserver) { %>, ActivatedRoute<% } %> } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { FsTabsModule } from '@firestitch/tabs';<% if(routeObserver) { %>
import { RouteObserver } from '@firestitch/core';<% } %>

import { filter } from 'rxjs/operators';

import { NavService } from '@common/services';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,

    MatCard,
    MatCardContent,
    MatTabsModule,

    FsTabsModule,
  ],
})
export class <%= classify(name) %>Component implements OnInit {

  public links: { path: string, label: string }[] = [];<%if (routeObserver) { %>
  public data: any;<% } %>

  private readonly _navService = inject(NavService);
  private readonly _router = inject(Router);
  private readonly _cdRef = inject(ChangeDetectorRef);<% if(routeObserver) { %>
  private readonly _route = inject(ActivatedRoute);
  private readonly _routeObserver$ = new RouteObserver(this._route, 'data');<% } %>
  private readonly _destroyRef = inject(DestroyRef);

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
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this._initTitle();

        this._cdRef.markForCheck();
      });
  }<% if(routeObserver) { %>

  private _initRouteObserver(): void {
    this._routeObserver$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((data) => {
        this.data = data;<% if(titledComponent) { %>
        this._initTitle();<% } %>

        this._cdRef.markForCheck();
      });
  }<% } %>

}
