import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { groupBy as _groupBy } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ObjectService } from '@app/core/services/';
import { Object } from '@app/shared/interfaces/';
import { ObjectClass } from '@app/shared/enums';
import { SourceObject } from 'app/shared/types';
import { ItemType } from '@firestitch/filter';
import { ObjectClasses } from 'app/shared/consts';
import { ObjectData } from 'app/core';


@Component({
  selector: 'app-related-objects',
  templateUrl: './related-objects.component.html',
  styleUrls: ['./related-objects.component.scss']
})
export class RelatedObjectsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('filter') public filterRef = null;

  @Input() public sourceObject: SourceObject = null;

  @Output() public highlightSwitch = new EventEmitter<any>();
  @Output() public remove = new EventEmitter<any>();
  @Output() public relatesChange = new EventEmitter<any>();

  public collections: { [key: string]: Object[] } = {};
  public previewEntity: Object = null;
  public objectClasses = [];
  public availableClasses = [];
  public config = null;

  private _destroy$ = new Subject();

  constructor(
    private _objectService: ObjectService,
    private _objectData: ObjectData,
    private _router: Router) {
  }

  public ngOnInit() {
    this.availableClasses = this._objectService.searchClasses;
    this.groupRelatedObjects();
    this.availableClassesSettings();
    this.initFilterConfig();
  }

  public ngOnChanges(changes: { sourceObject: SimpleChange }) {
    if (changes.sourceObject
      && changes.sourceObject.previousValue
      && changes.sourceObject.currentValue.id !== changes.sourceObject.previousValue.id) {
      this.groupRelatedObjects();
    }
  }

  public removeRelation(object: Object) {
    this._objectData.removeRelative(this.sourceObject.id, object.id)
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((response) => {
      const collection = this.collections[object.class];
      const removedObjIndex = collection.findIndex((entity) => object.id === entity.id);
      this.collections[object.class].splice(removedObjIndex, 1);
      this.remove.emit();
    })
  }

  public openPreview(entity: Object) {
    this.previewEntity = entity;
  }

  public formPath(sourceObject: SourceObject) {
    switch (sourceObject.class) {
      case ObjectClass.Doc: {
        return `/projects/${sourceObject.project.id}/docs`;
      }
      case ObjectClass.Task: {
        return `/projects/${sourceObject.project.id}/tasks`;
      }
      case ObjectClass.Asset: {
        return `/projects/${sourceObject.project.id}/images`;
      }
      default: {
        return '/projects';
      }
    }
  }

  public formQueryParams(sourceObject: Object) {
    const code = this._objectService.getObjectIdentifierCode(sourceObject.project, sourceObject);
    return { object: code };
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onRelatesChange($event) {
    this.relatesChange.emit($event);
  }

  public groupRelatedObjects(keyword = {}) {
    const query = {
      objects: true,
      projects: true,
      related_object_id: this.sourceObject.id
    };

    Object.assign(query, keyword);

    this._objectData.gets(query, { key: null })
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe((response) => {
      this.collections = _groupBy(response.objects, (val) => {
        return val.class;
      });
    });
  }

  public onHighlightSwitch($event) {
    this.groupRelatedObjects();
    this.highlightSwitch.emit($event);
  }

  public initFilterConfig() {
    this.config = {
      reload: false,
      items: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search',
          query: 'keyword'
        }
      ],
      change: (keyword) => {
        this.groupRelatedObjects(keyword);
      }
    };
  }

  private availableClassesSettings() {
    this.objectClasses = ObjectClasses.filter((value) => {
      return this.availableClasses.indexOf(value.value) !== -1;
    });
  }

}
