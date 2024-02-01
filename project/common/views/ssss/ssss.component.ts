import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsNavService } from '@firestitch/nav';
import { RouteObserver } from '@firestitch/core';


@Component({
  templateUrl: './ssss.component.html',
  styleUrls: ['./ssss.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SsssComponent implements OnInit  {

  public data: any;

  private _routeObserver$ = new RouteObserver(this._route, 'data');
  private _destroy$ = new Subject<void>();
  
  constructor(
    private _cdRef: ChangeDetectorRef,
    private _navService: FsNavService,
    private _route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this._initRouteObserver();
  }

  private _initRouteObserver(): void {
    this._routeObserver$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.data = data;
        this._initTitle();

        this._cdRef.markForCheck();
      });
  }

  private _initTitle(): void {
    this._navService.setTitle('Ssss');
  }

}
