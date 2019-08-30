import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RouteObserver } from '@firestitch/core';
import { FsFile } from '@firestitch/file';
import { ItemType } from '@firestitch/filter';
import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem } from '@firestitch/gallery';
import { list as fsList } from '@firestitch/common';

import { AssetData, ProjectData, ObjectFilterService, NavService } from '@app/core';
import { Project, Asset } from '@app/shared';


@Component({
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, OnDestroy {

  public project: Project = null;

  public routeObserver = new RouteObserver(this._route, 'project');

  @ViewChild('gallery')
  public gallery: FsGalleryComponent = null;

  public config: FsGalleryConfig = null;

  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _assetData: AssetData,
    private _projectData: ProjectData,
    private _navService: NavService,
    private _objectFilterService: ObjectFilterService
  ) { }

  public ngOnInit() {
    this.routeObserver
      .subscribe(project => {
        this.project = this._projectData.create(project);
        this.setTitle();
        this.initGalleryConfig();
      });
  }

  private initGalleryConfig() {
    this.config = {
      allowedFiles: 'image/*, application/*, video/*',
      nameField: 'file.name',
      fileField: 'file.file',
      thumbnailField: 'file.preview.small',
      imageField: 'file.preview.actual',
      filters: this._objectFilterService.getImageFilters(),
      reorderEnd: this.onReorderImages.bind(this),
      info: {
        icon: true,
        menu: {
          actions: [
            {
              label: 'Delete',
              click: (item: FsGalleryItem) => {
                this.onDeleteImage(item);
              }
            }
          ]
        }
      },
      fetch: query => {
        query.files = true;
        query.order = 'order';
        query[`project_id`] = this.project.id;

        return this._assetData.gets(query).pipe(takeUntil(this._destroy$));
      },
      upload: (files) => {
        this.uploadImage(files);
      }
    };
  }

  public uploadImage(files: FsFile[]) {

    const assets$ = [];

    files.forEach(fsFile => {
      const data: Asset = { id: null, project_id: this.project.id };

      data.file = fsFile.file;

      assets$.push(this._assetData.save(data));
    });

    forkJoin(...assets$)
      .subscribe(response => {
        this.gallery.refresh();
      });
  }

  public onDeleteImage(file) {
    this._assetData.delete(file)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.gallery.refresh();
      });
  }

  public onReorderImages(files: Asset[]) {
    const asset_ids = fsList(files, 'id').join(',');
    this._assetData
      .order({ asset_ids })
      .subscribe(() => { });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this.routeObserver.destroy();
  }

  private setTitle() {
    this._navService.setListTitleWithinEntity(
      'Images',
      this.project.name,
      this.project.image.small
    );
  }

}
