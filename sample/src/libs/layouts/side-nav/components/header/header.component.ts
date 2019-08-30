import { Component, OnInit } from '@angular/core';
import { FsStore } from '@firestitch/store';

import { SidenavService } from '../../services/sidenav.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public account;

  constructor(private _fsStore: FsStore,
              private _sidenavService: SidenavService) {
  }

  public ngOnInit() {
    this._fsStore.observe('account').subscribe((store) => {
      this.account = store.value;
    });
  }

  public sideNavClick() {
    this._sidenavService.toggle();
  }

}
