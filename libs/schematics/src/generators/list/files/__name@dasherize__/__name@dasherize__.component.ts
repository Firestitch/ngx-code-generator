import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';<% if (mode === 'full') { %>
import { Router, ActivatedRoute } from '@angular/router';<% } %><% if (mode !== 'full' && routeObserver) { %>
import { ActivatedRoute } from '@angular/router';<% } %>

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';<% if (titledComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %><% if(routeObserver) { %>
import { RouteObserver } from '@firestitch/core';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';<% } else { %>

import { map } from 'rxjs/operators';<% } %>

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

<% if (routableComponent) { %>
@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})<% } %><% if (!routableComponent) { %>
@Component({
  selector: 'app-<%=name%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})<% } %>
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;<%if (routeObserver) { %>
  public data: any;

  private _routeObserver$ = new RouteObserver(this._route, 'data');
  private _destroy$ = new Subject<void>();<% } %>

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,<% if (titledComponent) { %>
    private _navService: FsNavService,<% } %><% if (mode === 'full') { %>
    private _route: ActivatedRoute,
    private _router: Router,<% } %><% if(routeObserver) { %>
    private _route: ActivatedRoute,<% } %>
  ) {}

  public ngOnInit(): void {<% if(titledComponent) { %>
    this._setTitle();<% } %><% if(routeObserver) { %>
    this._waitRouteData();<% } %>
    this._initListConfig();
  }

  private _initListConfig(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      actions: [
        {
          label: 'Create',
          click: (event) => {<% if (mode === 'full') { %>
            this._router.navigate(['create'], { relativeTo: this._route });<%} if (mode === 'dialog' || mode === 'dialog-create-page-edit') {%>
            this.openDialog({});<%}%>
          },
        },
      ],
      rowActions: [
        {
          click: (data) => {
            return this._<%= camelize(serviceName) %>.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        return this._<%= camelize(serviceName) %>.gets(query, { key: null })
          .pipe(
            map((response: any) => {
              return { data: response.<%= pluralModel %>, paging: response.paging };
            }),
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._<%= camelize(serviceName) %>.put({ id: row.id, state: 'active' });
        },
      },
    };
  }<% if(routeObserver) { %>

  private _waitRouteData(): void {
    this._routeObserver$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.data = data;<% if(titledComponent) { %>
        this._setTitle();<% } %>
      });
  }<% } %><% if (titledComponent) { %>

  private _setTitle(): void {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>

}
