import { Component, Input, OnInit } from '@angular/core';

import { ObjectService } from '@app/core';
import { Project, Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-object-identifier',
  templateUrl: `./object-identifier.component.html`,
  styleUrls: ['./object-identifier.component.scss']
})
export class ObjectIdentifierComponent implements OnInit {

  public meta: any = null;

  @Input() set project(value: Project) {
    this._project = value;
    this.meta = this._objectService.objectIdentifier(this._project, this._object);
  }

  @Input() set object(value: Object) {
    this._object = value;
    this.meta = this._objectService.objectIdentifier(this._project, this._object);
  };

  private _project: Project = null;
  private _object: Object = null;

  constructor(private _objectService: ObjectService) { }

  public ngOnInit() {
  }

}
