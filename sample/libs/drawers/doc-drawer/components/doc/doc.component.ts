import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FS_FIELD_EDITOR_CONFIG } from '@firestitch/field-editor';
import { FsMessage } from '@firestitch/message';
import { DRAWER_DATA, DrawerRef } from '@firestitch/drawer';

import { TypeData, FieldData, DocData, ObjectService, ObjectData } from '@app/core';
import { Status, Type } from '@app/shared/interfaces';
import { Doc } from '../../interfaces';


@Component({
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit, OnDestroy {

  public doc: Doc = null;
  public types: Type[] = null;

  public config: any;

  public loading = true;

  public relatedObjects: Object[] = [];

  private _destroy$ = new Subject();

  constructor(
    private _docData: DocData,
    private _fsMessage: FsMessage,
    private _typeData: TypeData,
    private _fieldData: FieldData,
    private _objectService: ObjectService,
    private _objectData: ObjectData,
    public drawer: DrawerRef<DocComponent>,
    @Inject(DRAWER_DATA) public data,
    @Inject(FS_FIELD_EDITOR_CONFIG) private defaultConfig,
  ) {
  }

  public ngOnInit() {
    this.loading = true;
    this.drawer.dataChanged$.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.loading = false;
      this.doc = this.data.doc;

      this.config = {
//        fields: this.data.config,
        toolbar: {items: this.defaultConfig.toolbar.items}
      };

      this.getFieldData(this.data.config);

      this.getRelatedObjects();
    });

    this._typeData.gets({ class: 'doc' }).pipe(
      takeUntil(this._destroy$)
    ).subscribe((types) => {
      this.types = types;
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public tagsChanged(tags) {
    this.doc.tags = tags;
  }

  public changeType(type: Type) {
    this.doc.type = type;
    this.doc.type_id = type.id;
    this.save();
  }

  public changeStatus(status: Status) {
    this.doc.status = status;
    this.doc.status_id = status.id;
    this.save();
  }

  public getFieldData(config) {

    if (this.doc.object_version_id) {
      this._fieldData.getValues(this.doc.id, this.doc.id, this.doc.object_version_id)
        .pipe(
          takeUntil(this._destroy$)
        ).subscribe(
          data => {
            this.config.fields = data;
          }
        );
    } else {
      this.config.fields = config;
    }
  }

  public onNameChange() {
    if (this.doc.name) {
      this.save();
    }
  }

  public save() {
    this._docData.save(this.doc, { key: null })
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe(response => {
        this.doc = Object.assign(this.doc, response.doc);
        this._fsMessage.success('Saved Changes');
      });
  }

  public saveNewVersion() {

    this._docData.saveNewVersion(
      this.doc.id,
      {
        name: this.doc.name,
        content: this.doc.content,
        data: this.config.fields
      })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(doc => {

        this.doc.content = doc.content;
        this.doc.name = doc.name;
        this.doc.object_version_id = doc.object_version_id;
        this.doc.object_version = doc.object_version;
        this.config.fields = doc.data;
        this._fsMessage.success('Saved Changes');
      });
  }

  public changed(value: any) {
    this.doc.content = value;
  }

  public getRelatedObjects() {
    this._objectData.gets({ related_object_id: this.doc.id, objects: true, projects: true })
      .subscribe(response => this.relatedObjects = response);
  }

  public updateDoc(version: any) {

    this.doc.content = version.content;
    this.doc.object_version = version;
    this.doc.object_version_id = version.id;
    this.config.fields = version.fields;

    this._fsMessage.success('Version Switched');
  }
}
