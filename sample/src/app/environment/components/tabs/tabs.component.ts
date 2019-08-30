import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';

import { RouteObserver } from '@firestitch/core';
import { NavService } from '@app/core';
import { Environment } from '@app/shared';


@Component({
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {

  public environment: Environment = { id: null };
  private _destroy$ = new EventEmitter();
  public routeObserver = new RouteObserver(this._route, 'environment');
  public links = [];

  constructor(
    private _route: ActivatedRoute,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this._navService.routeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setTitle());

    this.routeObserver
      .subscribe(environment => {
        this.environment = Object.assign({ image: {} }, environment);
        this.setTitle();

        this.links = [
          { label: 'Settings', path: `./../${this.environment.id}/settings` },
          { label: 'Members', path: `./../${this.environment.id}/members` },
          { label: 'Roles', path: `./../${this.environment.id}/roles` },
          { label: 'Api Keys', path: `./../${this.environment.id}/apikeys` },
        ];
      });
  }

  private setTitle() {
    this._navService.setDetailTitle(
      this.environment.id ? null : 'Workspace',
      'Workspace',
      this.environment.id,
      this.environment.name,
      this.environment.image.small
    );
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
