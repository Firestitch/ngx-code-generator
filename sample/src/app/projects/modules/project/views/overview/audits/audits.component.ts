import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';

import { ProjectData, NavService } from '@app/core';
import { Project } from '@app/shared';

@Component({
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent implements OnInit {

  public project: Project = null;
  public routeObserver = new RouteObserver(this._route.parent, 'project');

  constructor(private _route: ActivatedRoute) {}

  public ngOnInit() {

    this.routeObserver
    .subscribe(project => {
      this.project = project;
    });

  }


}
