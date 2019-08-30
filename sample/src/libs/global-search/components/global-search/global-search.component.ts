import { Component, ViewChild, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { filter } from 'lodash-es';

import { filter as fsFilter, find, list, index } from '@firestitch/common';
import { ItemType, FilterConfig, FilterComponent } from '@firestitch/filter';

import {
  ObjectService,
  ObjectFilterService,
  TaskData,
  DocData,
  AssetData,
  ObjectData
} from '@app/core';
import { Object, SubsearchConfig } from '@app/shared/interfaces';
import { SourceObject } from '@app/shared/types';
import { ObjectClasses } from '@app/shared/consts';

enum SearchObjectClass {
  All = 'all',
  Doc = 'doc',
  Image = 'image',
  Task = 'task'
}

const SearchObjectClasses = [
  { name: 'All', value: SearchObjectClass.All, pluralName: 'All', mapKey: 'objects' },
  { name: 'Task', value: SearchObjectClass.Task, pluralName: 'Tasks', mapKey: 'tasks' },
  { name: 'Doc', value: SearchObjectClass.Doc, pluralName: 'Docs', mapKey: 'docs' },
  { name: 'Image', value: SearchObjectClass.Image, pluralName: 'Images', mapKey: 'assets' }
];

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {

  @Input() public advancedSearch = true;
  @Input() public selectable = false;
  @Input() public linkable = true;
  @Input() public selected = [];
  @Input() public availableClasses = this._objectService.searchClasses;
  @Input() public highlightOriginObject: Object = null;

  @Output() public selectedEntity = new EventEmitter();
  @Output() public goToEntity = new EventEmitter();
  @Output() public viewAllClicked = new EventEmitter();
  @Output() public highlightSwitch = new EventEmitter<any>();

  @ViewChild('filter') public filterRef: FilterComponent;
  @ViewChild('subsearch') public subsearchRef = null;

  public config: FilterConfig = null;
  public classesIndexed: any = null;
  public selectedClass: any = {};
  public objects: Object[] | SourceObject[] = [];
  public recentHistory: number[] = null;
  public subsearchConfig: SubsearchConfig = { groups: [] };
  public subsearchGroupsFlatten: any = {};
  public showSubsearch = false;
  public searchObjectClass = SearchObjectClass;
  public searchObjectClasses = SearchObjectClasses;
  public loading: Observable<any>;
  public hasMore = false;

  private _queryParams: any = {};
  private _paging: any = { limit: 10, offset: 0, records: 0 };
  private _destroy$ = new  Subject();

  constructor(
    private _objectService: ObjectService,
    private _objectData: ObjectData,
    private _objectFilterService: ObjectFilterService,
    private _taskData: TaskData,
    private _docData: DocData,
    private _assetData: AssetData
  ) { }

  public ngOnInit() {

    this.recentHistory = this._objectService.getRecent();
    this.classesIndexed = index(ObjectClasses, 'value');

    this.selectSearchClass(SearchObjectClass.All)
  }

  private createFilterConfig() {

    let items = [];
    if (this.selectedClass.value === SearchObjectClass.All) {
      items =
      [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        }
      ];
    }

    if (this.selectedClass.value === SearchObjectClass.Doc) {
      items = this._objectFilterService.getDocFilters();
    }

    if (this.selectedClass.value === SearchObjectClass.Task) {
      items = this._objectFilterService.getTaskFilters();
    }

    if (this.selectedClass.value === SearchObjectClass.Image) {
      items = this._objectFilterService.getImageFilters();
    }

    if (this.filterRef.config) {

      const keywordItem = this.filterRef.config.getItem('keyword');
      const newKeywordItem = items.find(item => { return item.name === keywordItem.name });

      if (newKeywordItem) {
        newKeywordItem.default = keywordItem.model;
      }
    }

    this.config = {
      items: items,
      chips: true,
      init: query => {
        this._clearPaging();
        this.query(query);
      },
      change: query => {
        this.recentHistory = null;
        this._clearPaging();
        this.query(query);
      }
    }
  }

  public query(query) {

    query.objects = true;
    query.projects = true;
    Object.assign(query, this._paging);
    query.class = this.availableClasses.join(',');

    let highlightedObjectsIds = [];
    if (this.highlightOriginObject) {
      for (const key in this.selected) {
        if (!this.selected[key]) {
          continue;
        }
        highlightedObjectsIds = [...highlightedObjectsIds, ...list(filter(this.selected[key], { related_object_highlight: 1 }), 'id')];
      }
    }

    if (this.recentHistory) {
      query.object_id = this.recentHistory;
    }

    this._queryParams = query;
    switch (this.selectedClass.value) {
      case SearchObjectClass.Task:
        this.loading = this._taskData.gets(query, { key: null });
        break;
      case SearchObjectClass.Doc:
        this.loading = this._docData.gets(query, { key: null });
        break;
      case SearchObjectClass.Image:
        this.loading = this._assetData.gets(query, { key: null });
        break;
      case SearchObjectClass.All:
        this.loading = this._objectData.gets(query, { key: null });
    }

    this.loading
      .pipe(
        takeUntil(this._destroy$),
        map((response: any) => {
          this._paging = response.paging;
          this.hasMore = this._paging.records > (this._paging.limit + this._paging.offset);
          return response[this.selectedClass.mapKey];
        })
      )
      .subscribe(response => {
        // FS-T1112 If origin object exists - exclude it from the search
        if (this.highlightOriginObject) {
          response = fsFilter(response, item => item.id !== this.highlightOriginObject.id);
        }

        if (this.recentHistory) {
          response.sort((a, b) => {
            return this.recentHistory.indexOf(a.id) - this.recentHistory.indexOf(b.id);
          });
        }

        response.forEach(object => {

          object['related_object_highlight'] = highlightedObjectsIds.indexOf(object.id) !== -1;
          object['selected'] = this.selected[object.class]
            ? this.selected[object.class].findIndex((obj) => obj.id === object.id) !== -1
            : false ;
        });

        this.objects = [...this.objects, ...response];
      });
  }

  public selectEntity(event, entity) {
    const data = this.getObjectById(entity);
    if (data) {
      data.selected = event.checked;
      this.selectedEntity.emit({ checked: event.checked, record: entity });
    }
  }

  public navigateTo(data: Object) {
    if (this.linkable) {
      this.goToEntity.emit(data);
    }
  }

  public selectSearchClass(value: SearchObjectClass, reload = false) {
    this.objects = [];
    this.hasMore = false;
    this.selectedClass = SearchObjectClasses.find(item => { return value === item.value });
    this.createFilterConfig();
    this._clearPaging();
    if (this.filterRef.config) {
      this.filterRef.hide();
      this.filterRef.change();
    }
  }

  public loadMore() {
    this._paging.offset += this._paging.limit;

    if (this._paging.records && this._paging.offset >= this._paging.records) {
      return;
    }

    this.query(this._queryParams);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onHighlightSwitch($event) {
    const data = this.getObjectById($event.related_object);
    data.related_object_highlight = $event.action === 'highlight' ? 1 : 0;
    this.highlightSwitch.emit($event);
  }

  private getObjectById(entity) {
    return find(this.objects, { id: entity.id });
  }

  private _clearPaging() {
    this._paging.offset = 0;
    this.objects = [];
  }
}
