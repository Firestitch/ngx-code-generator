import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { ContentData, NavService } from '@app/core';
import { ContentComponent } from '../content/content.component';


@Component({
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {

  @ViewChild('table')
  public table: FsListComponent;
  public config: FsListConfig;

  constructor(private _contentData: ContentData,
              private _dialog: MatDialog,
              private _navService: NavService) {
  }

  ngOnInit() {

    this._navService.setTitle('Content');

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      fetch: (query) => {
        return this._contentData.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.content_widgets, paging: response.paging }))
          );
      }
    }
  }

  public open(content_widget) {
    const dialogRef = this._dialog.open(ContentComponent, {
      width: '1500px',
      data: { content_widget: content_widget }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
