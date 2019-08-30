import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';
import { FsPrompt } from '@firestitch/prompt';
import { FsFileImagePickerComponent, FsFile } from '@firestitch/file';
import { Status } from '@firestitch/account-status';

import { AccountData, SessionService, AuthService } from '@app/core';
import { AccountStates } from '@app/shared/consts';
import { Account } from '@app/shared/interfaces';


@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit, OnDestroy {

  @Input('account')
  set setAccount(account) {
    this.account = account;
    this.isAccountSignedIn = account && account.id === this._sessionService.account().id;
  }

  @Input() public social = false;
  @Input() public socialEdit = false;

  @Output() public changeAccount = new EventEmitter<Account>();

  @ViewChild('avatarPicker') public avatarPicker: FsFileImagePickerComponent = null;

  public account: Account = null;
  public isAccountSignedIn = false;
  public socialAccounts: any = {};

  public statuses: Status[] = AccountStates;

  private _destroy$ = new Subject();

  constructor(
    private _accountData: AccountData,
    private _sessionService: SessionService,
    private _prompt: FsPrompt,
    private _authService: AuthService,
    private _message: FsMessage,
  ) { }

  public ngOnInit() {
  }

  public save() {
    this._accountData.save(this.account)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(account => {
        this._message.success('Saved Changes');
        this.onChangeAccount(account);
      });
  }

  public onUpload(fsFile: FsFile) {

    this._accountData.image(this.account, fsFile.file)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(
      (account) => {
        this._message.success('Image saved');
        this.onChangeAccount(account);
      },
      () => {
        this._message.error('Error. Something went wrong');
      },
      () => {
        this.avatarPicker.cancel();
      });
  }

  public changePassword(data) {

    this._accountData.putPasswordChange({
      id: this.account.id,
      password: data.new_password,
      current_password: data.current_password
    })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._message.success('Saved Changes');
      });
  }

  public resetPassword(data) {
    this._accountData.putPasswordReset({
      id: this.account.id,
      password: data.password,
      change_password: data.change_password,
      email_password: data.email_password
    })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._message.success('Saved Changes');
      });
  }

  public statusAction(data) {
    let query$ = null;
    let confirmMessage = '';
    let successMessage = 'Saved Changes';
    switch (data.action) {
      case 'activate':
        query$ = this._accountData.activate(this.account.id);
        confirmMessage = 'Are you sure you would like to activate this account?';
        break;
      case 'email_activation':
        query$ = this._accountData.emailActivation(this.account.id);
        confirmMessage = 'Are you sure you would like to send email?';
        successMessage = 'Email successfully sent';
        break;
      case 'delete':
        query$ = this._accountData.delete(this.account);
        confirmMessage = 'Are you sure you would like to delete this account?';
        break;
      case 'undelete':
        query$ = this._accountData.undelete(this.account.id, data.data);
        confirmMessage = 'Are you sure you would like to undelete this account?';
        break;
    }

    this._prompt.confirm({
      title: 'Confirm',
      template: confirmMessage
    })
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      query$
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(response => {

          this._accountData.get(this.account.id)
            .pipe(
              takeUntil(this._destroy$)
            )
            .subscribe(account => {
              this._message.success(successMessage);
              this.onChangeAccount(account);

              if (this.isAccountSignedIn && data.action === 'delete') {
                this._authService.signout();
              }
            });

        });
    });
  }

  private onChangeAccount(account: Account) {

    Object.assign(this.account, account);
    if (this.isAccountSignedIn) {
      this._sessionService.account(this.account);
    }
    this.changeAccount.emit(this.account);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
