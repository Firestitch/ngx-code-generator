import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { RouteObserver } from '@firestitch/core';

import { TypeData } from '@app/core';
import { Type } from '@app/shared';


@Component({
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  public type: Type = null;

  public routeObserver = new RouteObserver(this._route.parent, 'type');

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _message: FsMessage,
    private _typeData: TypeData
  ) { }

  public ngOnInit() {
    this.routeObserver
      .subscribe(type => {
        Object.assign(type, { class: this._route.snapshot.data.class });
        this.type = type;
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

  public save() {
    this._typeData.save(this.type)
      .subscribe(response => {
        this._message.success('Saved Changes');
        if (response.id && !this.type.id) {
          this._router.navigate([response.id], { relativeTo: this._route });
        }
      });
  }

}
