import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-object-version-item',
  templateUrl: './object-version-item.component.html',
  styleUrls: ['./object-version-item.component.scss']
})
export class ObjectVersionItemComponent implements OnInit {

  @Input() public selectedVersion: any = null;

  @Output() versionSelected = new EventEmitter<null>();
  @Output() versionSwitched = new EventEmitter<any>();

  constructor() {}

  public ngOnInit() {}

  public selectVersion(version) {
    this.versionSelected.emit(version);
  }

  public switchVersion() {
    this.versionSwitched.emit(this.selectedVersion);
  }
}
