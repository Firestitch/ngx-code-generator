import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { IFilterConfigItem, ItemType } from '@firestitch/filter';
import { nameValue } from '@firestitch/common';

import { Status, Type } from 'app/shared/interfaces';
import { AccountData, StatusData } from '../data';
import { WorkflowData } from '../data';
import { TypeData } from '../data';


@Injectable()
export class ObjectFilterService {

  private _taskFilterDueDateData = [
    { name: 'Any', value: '__all' },
    { name: 'Upcoming', value: 'upcoming' },
    { name: 'Overdue', value: 'overdue' },
    { name: 'Not Defined', value: 'not_defined' }
  ];

  constructor(
    private _statusData: StatusData,
    private _accountData: AccountData,
    private _workflowData: WorkflowData,
    private _typeData: TypeData
  ) { }

  public getDocFilters(statuses: Status[] = null, types: Type[] = null): IFilterConfigItem[] {
    return [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search'
      },
      {
        name: 'type_id',
        type: ItemType.Select,
        label: 'Type',
        values: types ? nameValue(types, 'name', 'id') : () => {
          return this._typeData.gets({ class: 'doc' })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
        }
      },
      {
        name: 'status_id',
        type: ItemType.Select,
        label: 'Status',
        values: statuses ? nameValue(statuses, 'name', 'id') : () => {
          return this._statusData.gets({ class: 'doc' })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
        }
      }
    ]
  }

  public getTaskFilters(statuses: Status[] = null): IFilterConfigItem[] {
    return [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search'
      },
      {
        name: 'due_date',
        type: ItemType.Select,
        label: 'Task Due',
        values: this._taskFilterDueDateData
      },
      {
        name: 'current_status_due',
        type: ItemType.Select,
        label: 'Current Status Due',
        values: this._taskFilterDueDateData
      },
      {
        name: 'status_id',
        type: ItemType.Select,
        label: 'Status',
        values: statuses ? nameValue(statuses, 'name', 'id') : () => {
          return this._statusData.gets({ class: 'task' })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
        }
      },
      {
        name: 'assigned_account_id',
        type: ItemType.AutoCompleteChips,
        label: 'Assigned To',
        values: (keyword) => {
          return this._accountData.gets({ keyword })
            .pipe(
              map(response => nameValue(response, 'name', 'id'))
            );
        }
      },
      {
        name: 'creator_account_id',
        label: 'Created By',
        type: ItemType.AutoCompleteChips,
        values: (keyword) => {
          return this._accountData.gets({ keyword })
            .pipe(map(response => nameValue(response, 'name', 'id')));
        }
      },
      {
        name: 'modify_date',
        label: 'Last Modified',
        type: ItemType.Date,
      },
      {
        name: 'workflow_id',
        label: 'Workflow',
        type: ItemType.AutoComplete,
        values: keyword => {
          return this._workflowData.gets({ keyword })
          .pipe(
            map(response => nameValue(response, 'name', 'id'))
          );
        }
      }
    ];
  }

  public getImageFilters(): IFilterConfigItem[] {
    return [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search',
        query: 'keyword'
      }
    ];
  }

}
