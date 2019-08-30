import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Object } from '@app/shared/interfaces';
import { TaskData, DocData, AssetData } from '@app/core';
import { SourceObject } from '@app/shared/types';



@Component({
  selector: 'app-related-object-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class RelatedObjectPreviewComponent implements OnInit, OnDestroy {
  @Input() public entity: Object= null;
  @Output() public entityChange = new EventEmitter<Object>();

  public fullEntity: SourceObject = null;

  private _service: TaskData | DocData | AssetData;
  private _query: any = {};

  private _destroy$ = new Subject();

  constructor(private _taskData: TaskData,
              private _docData: DocData,
              private _assetData: AssetData) {

  }

  public ngOnInit() {
    this._query = {
      projects: true,
      types: true,
    };

    switch(this.entity.class) {
      case 'task': {
        this._service = this._taskData;

        this._query.categories = true;
        this._query.statuses = true;
        this._query.assigned_accounts = true;
      } break;
      case 'doc': {
        this._service = this._docData;

        this._query.categories = true;
        this._query.statuses = true;
      } break;
      case 'asset': {
        this._service = this._assetData;

        this._query.files = true;
      } break;
    }

    this.loadData();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public close() {
    this.entity = null;
    this.entityChange.emit(this.entity);
  }

  private loadData() {
    if (this._service) {
      this._service.get(this.entity.id, this._query)
        .pipe(
          takeUntil(this._destroy$)
        ).subscribe((response: SourceObject) => {
        this.fullEntity = response;
      })
    }
  }
}
