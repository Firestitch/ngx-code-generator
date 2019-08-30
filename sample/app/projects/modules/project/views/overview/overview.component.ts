import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';

import { RouteObserver } from '@firestitch/core';

import { NavService } from '@app/core';
import { Project } from '@app/shared';


@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  public project: Project = { id: null };
  private _destroy$ = new EventEmitter();
  public routeObserver = new RouteObserver(this._route, 'project');
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
      .subscribe(project => {
        this.project = Object.assign({ image: {} }, project);
        this.setTitle();

        this.links = [
          { label: 'Settings', path: `/projects/${this.project.id}/overview/settings` },
          { label: 'Tags', path: `/projects/${this.project.id}/overview/tags` },
          { label: 'Audits', path: `/projects/${this.project.id}/overview/audits` }
        ];
      });
  }

  private setTitle() {
    this._navService.setDetailTitle(
      this.project.id ? null : 'Project',
      'Project',
      this.project.id,
      this.project.name,
      this.project.image.small
    );
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
