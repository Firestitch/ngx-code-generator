import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsPrompt } from '@firestitch/prompt';
import {
  DrawerRef,
  FsDrawerAction,
  FsDrawerService,
  IDrawerConfig,
} from '@firestitch/drawer';


import { DocData, FieldData } from '@app/core/data';
import { DocComponent, FieldEditComponent } from '../components';
import { Doc } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class DocDrawerService implements OnDestroy {

  public doc: Doc = null;
  public fields: any = [];

  private _drawerRef: DrawerRef<DocComponent> = null;
  private readonly removeClicked$ = new Subject<Doc>();
  private readonly drawerClosed$ = new Subject<Doc>();
  private _destroy = new Subject();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fsPrompt: FsPrompt,
    private _docData: DocData,
    private _drawer: FsDrawerService,
    private _dialog: MatDialog,
    private _fieldData: FieldData,
  ) {}

  get removeClicked(): Observable<Doc> {
    return this.removeClicked$.asObservable();
  }

  get drawerClosed(): Observable<Doc> {
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

  public openDrawer(docCode: string) {

    if (!this._drawerRef) {
      this.initAndOpenDrawer();
    }

    this.loadDoc(docCode);
  }

  public closeDrawer() {
    this._drawer.closeAll();
  }

  private loadDoc(docCode: string) {
    const query = {
      categories: true,
      projects: true,
      statuses: true,
      types: true,
      tags: true,
      object_versions: true,
      identifier: docCode
    };

    if (docCode) {
      this._docData.gets(query, { key: 'doc' })
        .pipe(
          takeUntil(this._destroy),
        ).subscribe((response) => {
          this._fieldData.getConfig(response.id).pipe(
            takeUntil(this._destroy)
          ).subscribe(fields => {
            this.fields = fields;
            this._drawerRef.dataChange({ doc: response, config: fields });
            this.doc = this._docData.create(response);
          });
        });
    } else {
      // TODO
      setTimeout(() => {
        this.doc = this._docData.create();
        this._drawerRef.dataChange({ doc: this.doc });
      }, 0)
    }
  }

  private initAndOpenDrawer() {
    const config: IDrawerConfig = {
      data: { doc: this.doc },
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
          }
        },
        // {
        //   icon: 'delete',
        //   name: 'remove',
        //   type: FsDrawerAction.button,
        //   tooltip: 'Remove',
        //   click: () => {
        //     this.deleteActionClicked(this.doc);
        //   },
        // },
        {
          icon: 'restore',
          name: 'versions',
          type: FsDrawerAction.Button,
          tooltip: 'Versions',
          click: () => {}
        },
        {
          icon: 'more_vert',
          type: FsDrawerAction.Menu,
          actions: [
            // {
            //   icon: null,
            //   label: 'Info',
            //   click: (event) => {
            //     this._drawerRef.setActiveAction('info');
            //   }
            // },
            {
              icon: null,
              label: 'Customize fields',
              click: (event, menuRef) => {
                this.openFieldEditor(this.fields)
                .subscribe(response => {
                    if (response) {
                      return this._drawerRef.dataChange({ doc: this.doc, config: response });
                    }
                });
              }
            },
            {
              icon: null,
              label: 'Delete',
              click: (event) => {
                this.deleteActionClicked(this.doc);
              }
            },
          ]
        },
      ]
    };

    this._drawerRef = this._drawer.open(DocComponent, config) as DrawerRef<DocComponent, any>;

    this._drawerRef.afterClosed().subscribe(() => {
      this.drawerClosed$.next(this.doc);
      this._drawerRef = null;
      this._destroy.next();
    });
  }

  private deleteActionClicked(doc) {

    this._fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to delete this doc?'
    }).pipe(
      takeUntil(this._destroy),
    ).subscribe(() => {
      this._docData.delete(doc)
        .pipe(
          takeUntil(this._destroy),
        )
        .subscribe(() => {
          this.removeClicked$.next(this.doc);
          this._drawerRef.close();
          this.navigateToParent();
        });
    });
  }

  public openFieldEditor(fields: any): Observable<any> {

    const dialogRef = this._dialog.open(FieldEditComponent, {
      width: '900px',
      data: { entity: this.doc, fields: fields }
    });

    return dialogRef.afterClosed();
  }

  private navigateToParent() {
    this._router.navigate(
      [],
      { relativeTo: this._route, queryParams: { object: null }, queryParamsHandling: 'merge' }
    );  }
}
