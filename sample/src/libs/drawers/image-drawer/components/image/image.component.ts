import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';

import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { DRAWER_DATA, DrawerRef } from '@firestitch/drawer';
import { FsGalleryComponent, FsGalleryConfig } from '@firestitch/gallery';

import { AssetData, ObjectData } from '@app/core';
import { Asset, Object } from '@app/shared/interfaces';


@Component({
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnDestroy {
  @ViewChild('gallery')
  public gallery: FsGalleryComponent;

  public asset: Asset = null;

  public relatedObjects: Object[] = [];

  public config: FsGalleryConfig = null;

  private _destroy$ = new Subject();

  constructor(
    private _drawer: DrawerRef<ImageComponent>,
    private _assetData: AssetData,
    private _message: FsMessage,
    private _objectData: ObjectData,
    @Inject(DRAWER_DATA) public data
  ) {
    this.asset = this.data.asset;
  }

  public ngOnInit() {
    this._drawer.dataChanged$.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.asset = this.data.asset;
      this.getRelatedObjects();
      this.initGalleryConfig();
    });

  }

  public save() {
    this._assetData.save(this.asset)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        this._message.success('Saved Changes');
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public changedContent(content) {
    this.asset.content = content;
  }

  public tagsChanged(tags) {
    this.asset.tags = tags;
  }

  public getRelatedObjects() {
    const query = {
      related_object_id: this.asset.id,
      objects: true,
      projects: true
    };

    this._objectData.gets(query)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => this.relatedObjects = response);
  }

  private initGalleryConfig() {
    this.config = {
      allowedFiles: 'image/*, application/*',
      imageField: 'file.preview.actual',
      thumbnailField: 'file.preview.small',
      fileField: 'file.url',
      nameField: 'file.name',
      info: false,
      toolbar: false,
      draggable: false,
      fetch: (query) => {
        return of([this.asset])
      },
    };
  }
}
