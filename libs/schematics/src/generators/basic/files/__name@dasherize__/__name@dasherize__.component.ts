import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,<% if(titledComponent || routeObserver) { %>
  OnInit,<% } %>
} from '@angular/core';<%if (routeObserver) { %>
import { ActivatedRoute } from '@angular/router';<% } %><% if(routeObserver) { %>

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';<% } %><% if(titledComponent || routeObserver) { %>

<% if(titledComponent) { %>import { FsNavService } from '@firestitch/nav';<% } %>
<% if(routeObserver) { %>import { RouteObserver } from '@firestitch/core';<% } %>
<% } else { %>
<% } %>

@Component({<%if(type==='component'){%>
  selector: 'app-<%=dasherize(name)%>',<%}%>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component<% if (titledComponent || routeObserver) { %> implements OnInit <%}%> {
<%if (routeObserver) { %>
  public data: any;

  private _routeObserver$ = new RouteObserver(this._route, 'data');
  private _destroy$ = new Subject<void>();
  <% } %>
  constructor(
    private _cdRef: ChangeDetectorRef,<% if (titledComponent) { %>
    private _navService: FsNavService,<% } %><% if(routeObserver) { %>
    private _route: ActivatedRoute,<% } %>
  ) {}<% if (titledComponent || routeObserver) { %>

  public ngOnInit(): void {
    <% if(titledComponent && !routeObserver) { %>this._initTitle();<%} else {%>this._initRouteObserver();<% } %>
  }<% } %><% if(routeObserver) { %>

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
  }<% } %><% if (titledComponent) { %>

  private _initTitle(): void {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>

}
