import { Component, Input } from '@angular/core';

import { Object, Status } from '@app/shared/interfaces';


@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss']
})

export class StatusPillComponent {

  public name = '';
  public color = '';

  @Input('status')
  set status(status: Status) {
    if (!status) {
      return;
    }
    this.color = status.color;
    this.name = status.name;
  };

  @Input('object')
  set object(object: Object) {
    if (!object) {
      return;
    }
    this.color = object.meta.color;
    this.name = object.name;
  };

}
