import { Injectable, Injector } from '@angular/core';

import { Subject } from 'rxjs';

import { DocDrawerService } from '../../doc-drawer/services/doc-drawer.service';
import { TaskDrawerService } from '../../task-drawer/services/task-drawer.service';
import { ImageDrawerService } from '../../image-drawer/services/image-drawer.service';

import { SourceObject } from '@app/shared/types';


@Injectable()
export class DrawerFactory {

  private readonly drawerClosed$ = new Subject<SourceObject>();
  private readonly removeClicked$ = new Subject<SourceObject>();
  private _drawer;
  private _objectCode = '';

  constructor(private _injector: Injector) {}

  get drawerClosed() {
    return this.drawerClosed$.asObservable();
  }

  get removeClicked() {
    return this.removeClicked$.asObservable();
  };

  public initDrawer(objectCode: string) {
    this._objectCode = objectCode;
    const type = this.parseCode(objectCode);
    this._drawer = null;

    switch (type) {
      case 'T': {
        this._drawer = this._injector.get(TaskDrawerService);
      } break;
      case 'D': {
        this._drawer = this._injector.get(DocDrawerService);
      } break;
      case 'I': {
        this._drawer = this._injector.get(ImageDrawerService);
      } break;
    }
  }

  public openDrawer() {
    if (this._drawer) {
      this.closeDrawer();
      this._drawer.openDrawer(this._objectCode);

      this._drawer.drawerClosed.subscribe((sourceObject: SourceObject) => {
        this.drawerClosed$.next(sourceObject);
      });

      this._drawer.removeClicked.subscribe((sourceObject: SourceObject) => {
        this.removeClicked$.next(sourceObject);
      })
    }
  }

  public closeDrawer() {
    if (this._drawer) {
      this._drawer.closeDrawer();
    }
  }

  private parseCode(code: string) {
    const type = code.match(/(.{1,10})-([TDI])(\d+)/);
    return type[2];
  }
}
