import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';

import { ProjectData, NavService } from '@app/core';
import { Doc } from '@libs/drawers/doc-drawer/interfaces';

@Component({
  selector: 'project-doc-audits',
  templateUrl: './projects-doc-audits.component.html',
  styleUrls: ['./projects-doc-audits.component.css']
})
export class ProjectsDocAuditsComponent implements OnInit {

  public doc: Doc = null;
  public routeObserver = new RouteObserver(this._route, 'doc');

  constructor(private _route: ActivatedRoute,
              private _navService: NavService) {}

  public ngOnInit() {

    this.routeObserver
    .subscribe(doc => {
      this.doc = doc;
      this.setTitle();
    });
  }

  private setTitle() {
    this._navService.setTitleWithArea(
      'Edit Docs',
      'Audits',
      this.doc.name,
      this.doc.project.image.small
    );
  }
}
