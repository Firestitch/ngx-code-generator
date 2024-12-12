import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';<% if(routeObserver) { %>
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';<% } %><% if (mode === 'full') { %>
import { Router, ActivatedRoute } from '@angular/router';<% } %><% if (mode !== 'full' && routeObserver) { %>
import { ActivatedRoute } from '@angular/router';<% } %>

import { FsListModule, FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';<% if (titledComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %><% if(routeObserver) { %>
import { RouteObserver } from '@firestitch/core';<% } %>

import { map } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({<% if (!routableComponent) { %>
  selector: 'app-<%=dasherize(name)%>',<% } %>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsListModule
  ],
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  public listConfig: FsListConfig;<%if (routeObserver) { %>
  public data: any;<% } %>

  private _cdRef = inject(ChangeDetectorRef);
  private _<%= camelize(serviceName) %> = inject(<%= classify(serviceName) %>);<% if (titledComponent) { %>
  private _navService = inject(FsNavService);<% } %><% if (mode === 'full') { %>
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);<% } %><% if(routeObserver) { %>
  private _route = inject(ActivatedRoute);
  private _routeObserver$ = new RouteObserver(this._route, 'data');<% } %>

  public ngOnInit(): void {<% if(titledComponent) { %>
    this._initTitle();<% } %><% if(routeObserver) { %>
    this._initRouteObserver();<% } %>
    this._initListConfig();
  }

  public reload(): void {
    this.list.reload();
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
          click: () => {<% if (mode === 'full') { %>
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
  }<% } %><% if (titledComponent) { %>

  private _initTitle(): void {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>

}

