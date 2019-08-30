import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, BehaviorSubject, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SidenavService implements OnDestroy {

  private xsmallBreakpoint = 599;
  private smallBreakpoint = 1023;
  private _destroy$ = new Subject();

  public opened = false;
  public items = new BehaviorSubject([]);
  public mode: 'over' | 'push' | 'side';
  public topGap: number;
  public resize$: Observable<any>;

  constructor() {
    this.updateSettings();

    this.resize$ = fromEvent(window, 'resize')
      .pipe(
        debounceTime(300)
      );

    this.resize$
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((e: any) => {
      this.updateSettings();
    });
  }

  public toggle() {
    this.opened = !this.opened;
  }

  public open() {
    this.opened = true;
  }

  public close() {
    this.opened = false;
  }

  public hide() {
    if (window.innerWidth < this.smallBreakpoint) {
      this.opened = false;
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private updateSettings() {
    if (window.innerWidth < this.smallBreakpoint) {
      this.mode = 'over';
      this.topGap = 56;
    } else {
      this.mode = 'side';
      this.opened = true;
      this.topGap = 0;
    }
  }
}
