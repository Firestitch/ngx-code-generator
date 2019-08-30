import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { filter, capitalize } from 'lodash-es';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { list, nameValue, sort, index } from '@firestitch/common';

import { ObjectService, ProjectData, AccountData, NavService } from '@app/core';
import { Object } from '../../../shared/interfaces';
import { ItemType } from '@firestitch/filter';
import { ObjectClasses } from '../../../shared/consts';
import { ObjectData } from 'app/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  public classesFlatten: any = null;
  public classesIndexed: any = null;

  private _queryParams: any = {};

  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _objectService: ObjectService,
    private _objectData: ObjectData,
    private _projectData: ProjectData,
    private _accountData: AccountData,
    private _navService: NavService
  ) { }

  public ngAfterViewInit() {
    this.setTitle();
  }

  public ngOnInit() {

    this.classesFlatten = list(ObjectClasses, 'name', 'value');
    this.classesIndexed = index(ObjectClasses, 'value');

    this._navService.routeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.setTitle());

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search'
        },
        {
          name: 'modify_date',
          type: ItemType.Date,
          label: 'Last Modified'
        },
        {
          name: 'creator_account_id',
          label: 'Account',
          type: ItemType.AutoCompleteChips,
          values: keyword => {
            return this._accountData.gets({ keyword })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
          }
        },
        {
          name: 'project_id',
          type: ItemType.Select,
          label: 'Project',
          multiple: true,
          model: [],
          values: () => {
            return this._projectData.gets()
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
          }
        },
        {
          name: 'class',
          type: ItemType.Select,
          label: 'Object Class',
          multiple: true,
          values: () => {

            const seachClasses = filter(ObjectClasses, (cls) => {
              return this._objectService.searchClasses.indexOf(cls.value) >= 0;
            });

            return sort(seachClasses, 'value');
          }
        }
      ],
      actions: [],
      rowActions: [],
      fetch: query => {
        console.log(query);
        Object.assign(query, {  objects: true,
                                projects: true,
                                modifier_accounts: true });

        if (!query.class) {
          query.class = this._objectService.searchClasses.join(',');
        }

        return this._objectData.gets(query, { key: null })
        .pipe(
          map(response => ({ data: response.objects, paging: response.paging }))
        );
      }
    }
  }

  public navigateTo(data: Object) {
    this._objectService.navigate(data);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private setTitle() {
    const query = this._route.snapshot.queryParams;

    if (query) {
      if (this._queryParams.keyword !== query.keyword && this._queryParams.class !== query.class) {
        this._queryParams.keyword = query.keyword || null;
        this._queryParams.class = query.class ? query.class.split(',') : [];

        setTimeout(() => {
          this.list.filter.updateValues(this._queryParams);
        }, 0);
      }
    }

    this._navService.setTitle('Search', capitalize(this._queryParams.class));
  }

}
