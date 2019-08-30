import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouteObserver } from '@firestitch/core';
import { FsMessage } from '@firestitch/message';
import { Field } from '@firestitch/field-editor/app/interfaces';

import { FieldData } from '@app/core';
import { Type } from '@app/shared';
import { FS_FIELD_EDITOR_CONFIG } from '@firestitch/field-editor';



@Component({
  templateUrl: './field-config.component.html',
  styleUrls: ['./field-config.component.css']
})
export class FieldConfigComponent implements OnInit, OnDestroy {

  public type: Type = null;

  public config: any;

  public routeObserver = new RouteObserver(this._route.parent, 'type');

  constructor(
    private _route: ActivatedRoute,
    private _fieldData: FieldData,
    private _message: FsMessage,
    @Inject(FS_FIELD_EDITOR_CONFIG) private defaultConfig,
  ) { }

  public ngOnInit() {


    this.routeObserver
      .subscribe(type => {
        Object.assign(type, { class: this._route.snapshot.data.class });
        this.type = type;

        this._fieldData.getConfig(this.type.id)
        .subscribe(response => {

          this.config = {
            fields: response,
            toolbar: {items: this.defaultConfig.toolbar.items}
          };

        });
      });
  }

  public ngOnDestroy() {
    this.routeObserver.destroy();
  }

  public submitFormData() {
    this._fieldData.updateConfig(this.type.id, { fields: this.config.fields })
      .subscribe(response => {
        this.config.fields = response;
        this._message.success('Form updated');
      });
  }
}
