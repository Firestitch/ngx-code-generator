import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';

import { WorkflowData, NavService } from '@app/core';
import { Workflow } from '@app/shared';


@Component({
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {

  public workflow: Workflow = null;

  public routeObserver = new RouteObserver(this._route, 'workflow');

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _message: FsMessage,
    private _workflowData: WorkflowData,
    private _navService: NavService
  ) { }

  public ngOnInit() {
    this.routeObserver
      .subscribe(workflow => {
        this.workflow = workflow;
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

  public save() {
    this._workflowData.save(this.workflow)
      .subscribe(response => {
        this._message.success(`Workflow successfully ${this.workflow.id ? 'saved' : 'created'}`);

        if (!this.workflow.id) {
          this._router.navigate([response.id], { relativeTo: this._route });
        }
      });
  }

  public cancel() {
    this._navService.goBack();
  }

}
