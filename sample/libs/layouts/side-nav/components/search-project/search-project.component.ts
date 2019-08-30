import { Component, OnInit } from '@angular/core';

import { SidenavMenuRef } from '@firestitch/sidenav';
import { ItemType } from '@firestitch/filter';

import { ProjectData, SessionService } from '@app/core';
import { Project } from '@app/shared/interfaces';


@Component({
  selector: 'app-search-project',
  templateUrl: './search-project.component.html',
  styleUrls: ['./search-project.component.scss']
})
export class SearchProjectComponent implements OnInit {

  public projects: Project[] = [];
  public query = null;
  public conf: any;
  public workspaceId: number = null;

  private _defaultParams = { page: 1, limit: 10, order: 'name,asc', workspace_id: null };

  constructor(public menuRef: SidenavMenuRef<SearchProjectComponent>,
              private _sessionService: SessionService,
              private _ProjectData: ProjectData) {
  }

  public ngOnInit() {

    this._defaultParams['workspace_id'] = this._sessionService.environment() ? this._sessionService.environment().id : null;

    this.conf = {
      reload: false,
      items: [
        {
          name: 'keyword',
          type: ItemType.Text,
          label: 'Search',
          query: 'keyword'
        }
      ],
      change: (query) => {
        this.query = query;
        const q = Object.assign({}, this.query, this._defaultParams);
        this._ProjectData.gets(q).subscribe((response) => {
          this.projects = response;
        })
      }
    };



    this._ProjectData.gets(this._defaultParams, { key: null })
      .subscribe((response) => {
        this.projects = response.projects;
    })

  }

  public close() {
    this.menuRef.close()
  }
}
