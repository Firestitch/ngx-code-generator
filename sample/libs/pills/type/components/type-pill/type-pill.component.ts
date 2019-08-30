import { Component, Input } from '@angular/core';

import { Type, Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-type-pill',
  templateUrl: './type-pill.component.html',
  styleUrls: ['./type-pill.component.scss']
})
export class TypePillComponent {

  public name = '';
  public icon = '';
  public color = '';

  @Input('type')
  set type(type: Type) {
    if (!type) {
      return;
    }
    this.color = type.color;
    this.icon = type.icon;
    this.name = type.name;
  };

  @Input('object')
  set object(object: Object) {
    if (!object) {
      return;
    }
    this.color = object.meta.color;
    this.icon = object.meta.icon;
    this.name = object.name;
  };

  @Input() public size = 30;
}
