import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Type } from '@app/shared/interfaces';
import { TypeData } from '@app/core/data';


@Component({
  selector: 'app-type-menu',
  templateUrl: './type-menu.component.html',
  styleUrls: ['./type-menu.component.scss']
})
export class TypeMenuComponent implements OnInit {

  @Input() class = '';
  @Input('type')
  set type(value: Type) {
    if (value) {
      this._type = value;
    }
  }

  @Output() typeChanged = new EventEmitter<Type>();

  get type(): Type {
      return this._type;
  }

  public types: Type[] = null;
  private _type: Type = null;

  constructor(private _typeData: TypeData) { }

  public ngOnInit() {
    this._typeData.gets({ class: this.class })
      .subscribe((response) => this.types = response);
  }

  public changeType(type: Type) {
    this.type = type;
    this.typeChanged.emit(this.type);
  }

  public compareFn(c1: Type, c2: Type): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
