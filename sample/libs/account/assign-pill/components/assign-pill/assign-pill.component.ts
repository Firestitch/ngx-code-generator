import { Component, Input } from '@angular/core';

import { Account } from '@app/shared/interfaces';


@Component({
  selector: 'app-account-assign-pill',
  templateUrl: './assign-pill.component.html',
  styleUrls: ['./assign-pill.component.scss']
})
export class AccountAssignPillComponent {
  @Input() public account: Account;
}
