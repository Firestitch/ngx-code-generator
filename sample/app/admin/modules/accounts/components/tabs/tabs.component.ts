import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from '@app/core';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {

  public navLinks;

  private _destroy$ = new Subject();

  constructor(private _navService: NavService,
              private _router: Router) {

    this._router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._destroy$)
    )
    .subscribe(() => this._setTitle());
   }


  public ngOnInit() {

    this.navLinks = [
      {
        path: ['/admin', 'accounts'],
        label: 'Accounts'
      },
      {
        path: 'roles',
        label: 'Roles'
      },
      {
        path: 'sessions',
        label: 'Sessions'
      }
    ];
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setTitle() {
    this._navService.setListTitle('Admin', 'Accounts');
  }

}
