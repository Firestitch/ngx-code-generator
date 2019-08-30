import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { forEach } from 'lodash-es';

import { FsStore } from '@firestitch/store';

import { AccountData, EnvironmentData } from 'app/core';
import { Account } from 'app/shared/interfaces';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './environment-switch.component.html',
  styleUrls: ['./environment-switch.component.scss']
})
export class EnvironmentSwitchComponent implements OnInit {

  public environments: any[] = [];
  public projectLimit = 5;
  public account: Account = null;

  constructor(
    private _dialogRef: MatDialogRef<EnvironmentSwitchComponent>,
    private _environmentData: EnvironmentData,
    private _accountData: AccountData,
    private _store: FsStore,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public ngOnInit(): void {

    this._store.observe('account').subscribe((store) => {
      this.account = store.value;

      this._accountData.getEnvironments(this.account.id, { projects: true })
      .pipe(
        map(response => {

          forEach(response, environment => {
            if (environment.projects.length > this.projectLimit) {
              environment.projects = environment.projects.slice(0, this.projectLimit);
            }
          });

          return response;
        })
      )
      .subscribe(response => this.environments = response);
    });
  }

  public switch(environment) {
    this._environmentData.switch(this.account.id, environment.id).subscribe(
      response => {
        this._store.set('environment', response);
        this._dialogRef.close();
        this._router.navigate(['blank']).then(() => {
          this._router.navigateByUrl('/projects');
        });
      }
    );
  }

  public close() {
    this._dialogRef.close()
  }
}
