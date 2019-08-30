import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouteObserver } from '@firestitch/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavService } from '@app/core';
import { TaskDrawerService } from '@libs/drawers/task-drawer';


import { Project } from '@app/shared';

@Component({
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [TaskDrawerService],
})
export class TasksComponent implements OnInit, OnDestroy {

  public project: Project = null;
  public projectRouteObserver = new RouteObserver(this._route, 'project');

  private _destroy = new Subject();

  constructor(
    private _navService: NavService,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.projectRouteObserver
      .subscribe(project => {
        this.project = project;
        this.setTitle();
      });

    this._navService.routeChange.pipe(
      takeUntil(this._destroy),
    ).subscribe(() => {
      this.setTitle();
    })
  }

  public ngOnDestroy() {
    this.projectRouteObserver.destroy();

    this._destroy.next();
    this._destroy.complete();
  }

  private setTitle() {
    this._navService.setListTitleWithinEntity(
      'Tasks',
      this.project.name,
      this.project.image.small
    );
  }
}
