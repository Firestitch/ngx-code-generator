import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsPrompt } from '@firestitch/prompt';
import {
  DrawerRef,
  FsDrawerAction,
  FsDrawerService,
  IDrawerConfig,
} from '@firestitch/drawer';

import { AssetData } from '@app/core/data';
import { Asset } from '@app/shared/interfaces';

import { ImageComponent } from '../components';


@Injectable({
  providedIn: 'root',
})
export class ImageDrawerService implements OnDestroy {

  public asset: Asset = null;

  private _drawerRef: DrawerRef<ImageComponent> = null;

  private readonly removeClicked$ = new Subject<Asset>();

  private readonly drawerClosed$ = new Subject<Asset>();

  private _destroy = new Subject();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fsPrompt: FsPrompt,
    private _assetData: AssetData,
    private _drawer: FsDrawerService,
  ) { }

  get removeClicked(): Observable<Asset> {
    return this.removeClicked$.asObservable();
  }

  get drawerClosed(): Observable<Asset> {
    return this.drawerClosed$.asObservable();
  }

  public ngOnDestroy() {
    if (this._drawerRef) {
      this._drawerRef.close();
    }

    this.removeClicked$.complete();
    this.drawerClosed$.complete();

    this._destroy.next();
    this._destroy.complete();
  }

  public openDrawer(assetCode: string) {

    if (!this._drawerRef) {
      this.initAndOpenDrawer();
    }

    this.loadAsset(assetCode);
  }

  public closeDrawer() {
    this._drawer.closeAll();
  }

  private initAndOpenDrawer() {
    const config: IDrawerConfig = {
      data: { asset: this.asset },
      disableClose: false,
      position: 'right',
      activeAction: 'settings',
      resize: {
        min: 500,
        max: null
      },
      actions: [
        {
          icon: 'clear',
          type: FsDrawerAction.Button,
          close: true,
          click: () => {
            this._drawerRef.close();
            this.navigateToParent();
          }
        },
        {
          icon: 'share',
          name: 'related',
          type: FsDrawerAction.Button,
          tooltip: 'Related Objects',
          click: () => {
            // this._drawerRef.openSide();
            // this._drawerRef.setActiveAction('related');
          }
        },
        {
          icon: 'photo',
          name: 'preview',
          type: FsDrawerAction.Button,
          tooltip: 'Preview',
          click: () => {
          }
        },
        {
          icon: 'delete',
          name: 'remove',
          type: FsDrawerAction.Button,
          tooltip: 'Remove',
          click: () => {
            this.deleteActionClicked(this.asset);
          }
        }
        // {
        //   icon: 'settings',
        //   name: 'settings',
        //   type: FsDrawerAction.button,
        //   tooltip: 'Settings',
        //   click: () => {
        //   }
        // }
      ]
    };

    this._drawerRef = this._drawer.open(ImageComponent, config) as DrawerRef<ImageComponent, any>;

    this._drawerRef.afterClosed().subscribe(() => {
      this.drawerClosed$.next(this.asset);
      this._drawerRef = null;
      this._destroy.next();
    });
  }

  private deleteActionClicked(asset: Asset) {

    this._fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to delete this asset?'
    }).pipe(
      takeUntil(this._destroy),
    ).subscribe(() => {
      this._assetData.delete(asset)
        .pipe(
          takeUntil(this._destroy)
        )
        .subscribe(() => {
          this.removeClicked$.next(this.asset);
          this._drawerRef.close();
          this.navigateToParent();
        });
    });
  }

  private navigateToParent() {
    this._router.navigate(
      [],
      { relativeTo: this._route, queryParams: { object: null }, queryParamsHandling: 'merge' }
    );  }

  private loadAsset(assetCode: string) {
    const query = {
      projects: true,
      files: true,
      tags: true,
      modifier_accounts: true,
      identifier: assetCode
    };

    if (assetCode) {
      this._assetData.gets(query, { key: 'asset' })
        .pipe(
          takeUntil(this._destroy)
        )
        .subscribe((response) => {
          this._drawerRef.dataChange({ asset: response });
          this.asset = this._assetData.create(response);
        });
    } else {
      this.asset = this._assetData.create();
      this._drawerRef.dataChange({ asset: this.asset });
    }
  }

}
