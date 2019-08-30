import { Component, OnDestroy, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NavService } from '@app/core';


@Component({
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  private _destroy = new Subject();

  constructor(
    private _navService: NavService
  ) {}

  public ngOnInit() {
    this.setTitle();

    this._navService.routeChange.pipe(
      takeUntil(this._destroy),
    ).subscribe(() => {
      this.setTitle();
    })
  }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  private setTitle() {
    this._navService.setListTitle(null, 'Tasks');
  }
}
