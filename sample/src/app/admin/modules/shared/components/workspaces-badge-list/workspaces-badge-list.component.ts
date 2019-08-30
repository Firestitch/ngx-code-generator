import { Component, Input } from '@angular/core';
import { Workspace } from '@app/shared';


@Component({
  selector: 'workspaces-badge-list',
  templateUrl: './workspaces-badge-list.component.html',
})
export class WorkspacesBadgeListComponent {

  @Input() public limit = 3;

  @Input() set workspaces(workspacesArray: Workspace[]){
    if (workspacesArray.length > this.limit) {
      this._workspaces = workspacesArray.slice(0, this.limit);
    } else {
      this._workspaces = workspacesArray
    }

    this.allWorkspaces = workspacesArray;
  }

  get workspaces() {
    return this._workspaces;
  }

  public allWorkspaces: Workspace[] = [];
  private _workspaces: Workspace[] = [];

  constructor() {

  }
}
