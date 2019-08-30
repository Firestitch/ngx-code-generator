import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from 'app/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  templateUrl: './logs-tabs.component.html',
  styleUrls: ['./logs-tabs.component.scss']
})
export class LogsTabsComponent implements OnInit, OnDestroy {

  public links = [];

  private _destroy$ = new Subject();

  constructor(private _router: Router,
              private _navService: NavService) { }

  public ngOnInit() {
    this._setTitle();
    this.links = [
      { label: 'Server Logs', path: 'server' },
      { label: 'Upgrade Logs', path: 'upgrade' },
      { label: 'API Logs', path: 'api' }
    ];

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._setTitle());

  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setTitle() {
    this._navService.setListTitle('System', 'Logs');
  }
}
