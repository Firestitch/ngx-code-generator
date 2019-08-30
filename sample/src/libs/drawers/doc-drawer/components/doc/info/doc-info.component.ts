import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TypeData } from '@app/core';
import { Type } from '@app/shared';

import { Doc } from '../../../interfaces';


@Component({
  selector: 'app-doc-info',
  templateUrl: './doc-info.component.html',
  styleUrls: ['./doc-info.component.scss']
})
export class DocInfoComponent implements OnInit {

  @Input() public doc: Doc = null;
  @Output() typeChanged = new EventEmitter<Type>();

  public types: Type[] = [];

  constructor(private _typeData: TypeData) {}

  public ngOnInit() {
    this._typeData.gets({ class: 'doc' }).subscribe(response => this.types = response);
  }

  public changeType(type_id: number) {

    if (type_id !== this.doc.type_id) {
      this.typeChanged.emit(this.types.find(type => type.id === type_id));
    }
  }
}
