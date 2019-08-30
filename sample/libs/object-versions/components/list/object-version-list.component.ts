import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ObjectService, ObjectData } from '@app/core';

@Component({
  selector: 'app-object-version-list',
  templateUrl: './object-version-list.component.html',
  styleUrls: ['./object-version-list.component.scss']
})
export class ObjectVersionListComponent implements OnInit {

  @Output() versionSelected = new EventEmitter<any>();

  @Input() public object: any = null;

  public objectVersions: any = [];

  public selectedVersion: any = null;

  constructor(private _objectService: ObjectService,
              private _objectData: ObjectData) {}

  public ngOnInit() {
    this._objectData.getVersions(this.object.id, { accounts: true, statuses: true }).subscribe(
      response => this.objectVersions = response
    );
  }

  public selectVersion(version) {
    this.versionSelected.emit(version);
  }
}
