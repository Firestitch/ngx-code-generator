import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EnvironmentData } from 'app/core';
import { Workspace } from '@app/shared/interfaces';


@Component({
  templateUrl: './workspace-create.component.html',
  styleUrls: ['./workspace-create.component.scss']
})
export class WorkspaceCreateComponent {

  public workspace: Workspace = { id: null };

  public constructor(
    private _dialogRef: MatDialogRef<WorkspaceCreateComponent>,
    private _environmentData: EnvironmentData,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.workspace = Object.assign({}, data.workspace);
  }

  public save() {
    this._environmentData.save(this.workspace)
      .subscribe(response => {
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }
}
