import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig, ReorderPosition, ReorderStrategy } from '@firestitch/list';
import { list } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';
import { ItemType } from '@firestitch/filter';

import { TypeData } from '@app/core';
import { Type } from '@app/shared';
import { State } from '@app/shared';


@Component({
  selector: 'app-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss']
})
export class TypesListComponent implements OnInit {

  @Input() public class = 'task';

  @Output() public update = new EventEmitter<Type>();

  @ViewChild('list')
  public list: FsListComponent = null;

  public config: FsListConfig = null;

  constructor(
    private _typeData: TypeData,
    private _prompt: FsPrompt
  ) { }

  public ngOnInit() {
    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create Type',
          click: (event) => {
            this.onUpdate();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._typeData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this type?',
          },
          menu: true,
          label: 'Delete'
        }
      ],
      reorder: {
        position: ReorderPosition.Left,
        strategy: ReorderStrategy.Always,
        done: (data) => {
          this.saveOrder(data);
        }
      },
      fetch: query => {
        Object.assign(query, { order: 'order', class: this.class, workflows: true });
        return this._typeData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.types, paging: response.paging }))
          );
      },
      restore: {
        query: {state: State.Deleted},
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row) => {
          return this._typeData.put({id: row.id, state: State.Active})
        }
      }
    };
  }

  public onUpdate(type: Type = { id: null }) {
    this.update.emit(type);
  }

  private saveOrder(data) {
    this._typeData.order({
      type_ids: list(data, 'id'),
      limit: data.length,
      page: this.list.list.paging.page
    })
    .subscribe(() => {
      this.list.reload();
    });
  }

}
