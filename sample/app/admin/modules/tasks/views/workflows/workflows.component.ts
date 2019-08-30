import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { nameValue } from '@firestitch/common';
import { ItemType } from '@firestitch/filter';

import { WorkflowData, TypeData } from '@app/core';
import { Workflow } from '@app/shared';
import { State } from '@app/shared';


@Component({
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {

  @ViewChild('list')
  public list: FsListComponent = null;
  public config: FsListConfig = null;

  constructor(
    private _workflowData: WorkflowData,
    private _typeData: TypeData,
    private _router: Router,
    private _dialog: MatDialog
  ) { }

  public ngOnInit() {

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },
        {
          name: 'type_ids',
          type: ItemType.Select,
          label: 'Task Type',
          multiple: true,
          model: [],
          values: () => {
            return this._typeData.gets({ class: 'task' })
              .pipe(
                map(response => nameValue(response, 'name', 'id'))
              );
          },
        },
      ],
      actions: [
        {
          label: 'Create Workflow',
          click: (event) => {
            this.update();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._workflowData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this workflow?',
          },
          menu: true,
          label: 'Delete'
        },
        {
          click: data => {
            return this._workflowData.setDefault(data.id).subscribe(response => {
              this.list.reload();
            });
          },
          menu: true,
          label: 'Set As Default',
          show: (row) => !row.default,
        },
      ],
      fetch: query => {
        Object.assign(query, { class: 'general' });
        return this._workflowData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.workflows, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row) => {
          return this._workflowData.put({id: row.id, state: 'active'})
        }
      }
    };
  }

  public update(workflow: Workflow = { id: null }) {

    const data: any = ['/admin', 'tasks', 'workflow'];

    if (workflow.id) {
      data.push(workflow.id);
    }

    this._router.navigate(data);
  }
}
