import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { FsListComponent, FsListConfig, ReorderPosition, ReorderStrategy } from '@firestitch/list';
import { list } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';

import { CategoryData } from '@app/core';
import { Category } from '@app/shared';
import { ItemType } from '@firestitch/filter';
import { map } from 'rxjs/operators';
import { State } from '@app/shared';


@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  @Input() public class = 'task';

  @Output() public update = new EventEmitter<Category>();

  @ViewChild('list')
  public list: FsListComponent = null;

  public config: FsListConfig = null;

  constructor(
    private _categoryData: CategoryData
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
          label: 'Create Category',
          click: (event) => {
            this.onUpdate();
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._categoryData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this category?',
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
        Object.assign(query, { class: this.class, order: 'order' });
        return this._categoryData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.categories, paging: response.paging }))
          );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row) => {
          return this._categoryData.put({id: row.id, state: State.Active})
        }
      }
    };
  }

  public onUpdate(category: Category = { id: null, class: this.class }) {
    this.update.emit(category);
  }

  private saveOrder(data) {
    this._categoryData.order({
      category_ids: list(data, 'id'),
      limit: data.length,
      page: this.list.list.paging.page
    })
    .subscribe(() => {
      this.list.reload();
    });
  }

}
