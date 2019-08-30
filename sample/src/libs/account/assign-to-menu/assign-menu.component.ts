import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AccountData } from '@app/core';
import { Account } from '@app/shared/interfaces';


@Component({
  selector: 'app-assign-to-menu',
  templateUrl: './assign-menu.component.html',
  styleUrls: ['./assign-menu.component.scss']
})
export class AccountAssignMenuComponent implements OnInit {
  @Input()
  public label = 'Assign to';

  @Input('account')
  set account(value: Account) {
    if (value) {
      this._account = value;
    }
  }

  get account(): Account {
    return this._account;
  }

  @Output() accountChanged = new EventEmitter<Account>();

  public accounts: Account[] = null;

  private _account: Account = null;

  constructor(private _accountData: AccountData) {}

  public ngOnInit() {
    this._accountData.gets().subscribe(response => this.accounts = response);
  }

  public changeAccount(account: Account) {
    this.account = account;
    this.accountChanged.emit(this.account);
  }

  public compareFn(accountOne: Account, accountTwo: Account ): boolean {
    return accountOne && accountTwo && accountOne.id === accountTwo.id;
  }
}
