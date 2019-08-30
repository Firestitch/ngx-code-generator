import { Component, Input } from '@angular/core';

import { Account, Object } from '@app/shared/interfaces';


@Component({
  selector: 'app-account-image',
  templateUrl: `./account-image.component.html`,
  styleUrls: ['./account-image.component.scss']
})
export class AccountImageComponent {

  public name = '';
  public firstName = '';
  public lastInitial = '';

  public image: string = null;

  @Input() public size = 30;
  @Input() public shortName = false;
  @Input() public longName = false;

  @Input('account')
  set account(account: Account) {
    if (account) {
      this.image = account.image.small;
      this.name = account.name;
      this.firstName = account.first_name;
      this.lastInitial = String(account.last_name).substr(0,1);
    }
  };

  @Input('object')
  set object(object: Object) {
    if (!object) {
      return;
    }
    object.meta = object.meta || {};
    object.meta.last_name = `${object.meta.last_name}`;
    this.image = object.image_url;
    this.name = object.name;
    this.firstName = object.meta.first_name;
    this.lastInitial = object.meta.last_name.substr(0, 1);
  };
}
