import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteObserver } from '@firestitch/core';

import { Project } from '@app/shared';


@Component({
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  public project: Project = null;

  public routeObserver = new RouteObserver(this._route.parent, 'project');

  constructor(
    private _route: ActivatedRoute
  ) { }

  public ngOnInit() {

    this.routeObserver
      .subscribe((project: Project) => {
        this.project = project;
      });
  }
}
