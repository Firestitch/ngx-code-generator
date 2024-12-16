import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,<% if(titledComponent || routeObserver) { %>
  OnInit,
  inject,<% } %><% if(routeObserver) { %>
  DestroyRef,<% } %>
} from '@angular/core';<% if(routeObserver) { %>
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';<% } %><%if (routeObserver) { %>
import { ActivatedRoute } from '@angular/router';<% } %><% if(titledComponent || routeObserver) { %><% if(titledComponent) { %>

import { FsNavService } from '@firestitch/nav';<% } %><% if(routeObserver) { %>
import { RouteObserver } from '@firestitch/core';<% } %><% } %>

@Component({<%if(type==='component'){%>
  selector: 'app-<%=dasherize(name)%>',<%}%>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class <%= classify(name) %>Component<% if (titledComponent || routeObserver) { %> implements OnInit <%}%> {
<%if (routeObserver) { %>
  public data: any;
  <% } %>
  private readonly _cdRef = inject(ChangeDetectorRef);<% if (titledComponent) { %>
  private readonly _navService = inject(FsNavService);<% } %>
  <%if (routeObserver) { %>private readonly _route = inject(ActivatedRoute);
  private readonly _routeObserver$ = new RouteObserver(this._route, 'data');
  private readonly _destroyRef = inject(DestroyRef);<% } %>
  <% if (titledComponent || routeObserver) { %>
  public ngOnInit(): void {
    <% if(titledComponent && !routeObserver) { %>this._initTitle();<%} else {%>this._initRouteObserver();<% } %>
  }<% } %><% if(routeObserver) { %>

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
  }<% } %><% if (titledComponent) { %>

  private _initTitle(): void {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>

}
