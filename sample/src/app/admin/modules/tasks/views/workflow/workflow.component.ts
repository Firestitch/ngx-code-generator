import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';

import { RouteObserver } from '@firestitch/core';

import { Workflow } from '@app/shared';
import { NavService } from '@app/core';


@Component({
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  public workflow: Workflow = null;

  public navLinks = [];

  public routeObserver = new RouteObserver(this._route, 'workflow');

  private _destroy$ = new EventEmitter();

  constructor(
    private _route: ActivatedRoute,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this.workflow = this._route.snapshot.data.workflow;

    this._navService.routeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setTitle());

    this.routeObserver
      .subscribe(workflow => {
        this.workflow = workflow;
        this.setTitle();

        this.navLinks = [
          {
            path: ['/admin', 'tasks', 'workflow', this.workflow.id],
            label: 'GENERAL'
          },
          {
            path: 'design',
            label: 'DESIGN'
          }
        ];

      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    this._navService.setTitleWithParent(
      'Admin',
      'Tasks',
      'Workflow',
      this.workflow.name
    );
  }

}
