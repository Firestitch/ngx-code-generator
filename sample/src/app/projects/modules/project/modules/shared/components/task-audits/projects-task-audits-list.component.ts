import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteObserver } from '@firestitch/core';

import { NavService } from '@app/core';
import { Task } from '@app/shared';


@Component({
  selector: 'projects-task-audits-list',
  templateUrl: './projects-task-audits-list.component.html',
  styleUrls: ['./projects-task-audits-list.component.css']
})
export class ProjectsTaskAuditsListComponent implements OnInit {

  public task: Task = null;
  public routeObserver = new RouteObserver(this._route, 'task');

  constructor(
    private _route: ActivatedRoute,
    private _navService: NavService
  ) { }

  public ngOnInit() {

    this.routeObserver
    .subscribe(task => {
      this.task = task;
      this.setTitle();
    });
  }

  private setTitle() {
    this._navService.setTitleWithArea(
      'Edit Tasks',
      'Audits',
      this.task.name,
      this.task.project.image.small
    );
  }


}
