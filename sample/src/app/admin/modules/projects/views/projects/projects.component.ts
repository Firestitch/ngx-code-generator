import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavService } from '@app/core';


@Component({
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  public navLinks = [];

  private _destroy$ = new Subject();

  constructor(
    private _router: Router,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this.init();

    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this.init());

    this.navLinks = [
      // {
      //   path: ['/admin', 'tasks', 'types'],
      //   label: 'TYPES'
      // },
      {
        path: 'statuses',
        label: 'STATUSES'
      },
      // {
      //   path: 'categories',
      //   label: 'CATEGORIES'
      // },
      // {
      //   path: 'workflows',
      //   label: 'WORKFLOWS'
      // }
    ];
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private init() {
    this._navService.setListTitle('Admin', 'Project Statuses');
  }

}
