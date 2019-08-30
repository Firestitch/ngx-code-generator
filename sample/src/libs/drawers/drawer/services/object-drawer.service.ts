import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawerFactory } from './drawer.factory';
import { SourceObject } from 'app/shared/types/';
import { ObjectService, NavService } from 'app/core';
import { Project, Object } from 'app/shared';
import { Location } from '@angular/common';


@Injectable()
export class ObjectDrawerService implements OnDestroy {

  private readonly drawerClosed$ = new Subject<SourceObject>();
  private readonly removeClicked$ = new Subject<SourceObject>();
  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _navService: NavService,
    private _drawerFactory: DrawerFactory,
    private _objectService: ObjectService,
    private _location: Location,
  ) {

    this._navService.routeChange
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {

        this._drawerFactory.closeDrawer();

        const queryParams = this._route.snapshot.queryParams;
        if (queryParams.object) {
          this.initDrawer(queryParams.object);
        }
      });
  }

  get removeClicked(): Observable<SourceObject> {
    return this.removeClicked$.asObservable();
  }

  get drawerClosed(): Observable<SourceObject> {
    return this.drawerClosed$.asObservable();
  }

  public initDrawer(objectCode: string) {
    this._drawerFactory.initDrawer(objectCode);
    this.openDrawer();
  }

  public openObjectDrawer(project: Project, object: Object) {
    const identifier = this._objectService.getObjectIdentifierCode(project, object);
    this.initDrawer(identifier);

    const url = this
    ._router
    .createUrlTree([], {
      relativeTo: this._route,
      queryParams: { object: identifier },
      queryParamsHandling: 'merge' })
    .toString();

    this._location.go(url);
  }

  public openDrawer() {
    this._drawerFactory.openDrawer();

    this._drawerFactory.drawerClosed
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((sourceObject: SourceObject) => {
        this.drawerClosed$.next(sourceObject);
      });

    this._drawerFactory.removeClicked
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((sourceObject: SourceObject) => {
        this.removeClicked$.next(sourceObject);
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public closeAll() {
    this._drawerFactory.closeDrawer();
  }
}
