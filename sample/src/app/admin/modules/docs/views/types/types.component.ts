import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Type } from '@app/shared';


@Component({
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  public ngOnInit() {
  }

  public onUpdate(type: Type = { id: null }) {
    const data: any[] = ['/admin', 'docs', 'type'];
    if (type.id) {
      data.push(type.id);
    }

    this._router.navigate(data);
  }

}
