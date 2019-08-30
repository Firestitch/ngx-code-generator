import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ObjectService, FieldData, ObjectData } from '@app/core';


@Component({
  selector: 'app-object-versions',
  templateUrl: './object-versions.component.html',
  styleUrls: ['./object-versions.component.scss']
})
export class ObjectVersionsComponent implements OnInit {

  @Input() public object: any = null;
  @Output() versionChanged = new EventEmitter<any>();

  public objectVersions: any = [];

  public selectedVersion: any = null;

  constructor(private _objectService: ObjectService,
              private _objectData: ObjectData,
              private _fieldData: FieldData) {}

  public ngOnInit() {}

  public selectVersion(version) {

    if (version && version.id) {
      this._fieldData.getValues(
        version.object_id,
        version.object_id,
        version.id, { config: true }, { key: null })
      .subscribe(response => {
        version.fields = response;
      });
    }

    this.selectedVersion = version;
  }

  public switchVersion(version) {
    this._objectData.restoreVersion(this.object.id, version.id).subscribe(response => {
      this.versionChanged.emit(response);
    });
  }
}
