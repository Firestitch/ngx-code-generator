import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material';

import { RouteObserver } from '@firestitch/core';
import { FsListAbstractRow, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';
import { list as fsList } from '@firestitch/common';
import { SelectionActionType } from '@firestitch/selection';

import { Observable, Subject } from 'rxjs';
import { takeUntil, map, flatMap } from 'rxjs/operators';

import {
  DocData,
  TypeData,
  StatusData,
  NavService,
  ObjectService,
  ObjectFilterService
} from '@app/core';

import { DocCreateComponent } from '@libs/related-objects';
import { ProjectData } from '@app/core';

import { Object } from '@app/shared';
import { Project } from '@app/shared';
import { State } from '@app/shared';
import { Doc } from '@libs/drawers/doc-drawer/interfaces';
import { ObjectDrawerService } from 'libs/drawers/drawer';


@Component({
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
})
export class DocsComponent implements OnInit, OnDestroy {

  @ViewChild('DocsList') public listRef = null;

  public project: Project = null;
  public config: FsListConfig = null;
  public projectRouteObserver = new RouteObserver(this._route, 'project');
  public docRouteObserver = new RouteObserver(this._route, 'doc');

  public states = {
    active: State.Active,
    deleted: State.Deleted
  };

  private _destroy$ = new Subject();

  constructor(
    private _docData: DocData,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _fsPrompt: FsPrompt,
    private _objectDrawerService: ObjectDrawerService,
    private _ProjectData: ProjectData,
    private _navService: NavService,
    private _objectFilterService: ObjectFilterService
  ) { }

  public ngOnInit() {

    this.projectRouteObserver
      .subscribe(project => {
        this.project = this._ProjectData.create(project);

        this.setTitle();
        this.initConfig();

        if (this.listRef) {
          this.listRef.reload();
        }
      });

      this._objectDrawerService.removeClicked
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this.listRef.reload();
        });

      this._objectDrawerService.drawerClosed
        .pipe(
          takeUntil(this._destroy$)
        ).subscribe((doc: Doc) => {
          this.listRef.updateData(
            doc,
            (row: FsListAbstractRow) => {

              // Do recursive actions manually. List doesn't support deep merge
              if (row.id === doc.id) {
                row.tags = doc.tags;
              }

              return row.id === doc.id;
            });
        });

    this._navService.routeChange.pipe(
      takeUntil(this._destroy$),
    ).subscribe(() => {
      this.setTitle();
      this.initConfig();
    });
  }

  public ngOnDestroy() {
    this.projectRouteObserver.destroy();

    this._destroy$.next();
    this._destroy$.complete();
  }

  public initConfig() {
    this.config = {
      filters: this._objectFilterService.getDocFilters(),
      actions: [
        {
          label: 'Create Doc',
          click: (event) => {
            this.createDoc();
          }
        }
      ],
      selection: {
        actions: [
          {
            type: SelectionActionType.Action,
            label: 'Delete',
            value: 'delete'
          }
        ],
        onAction: action => {
          let subscription$ = this.deleteDocs(action.selectedRows);

          subscription$
            .subscribe({
              next: () => {
                this.listRef.reload();
              }
            });

          return subscription$;
        },
        onSelectAll: () => { },
        onCancel: () => { }
      },
      rowActions: [
        {
          click: data => {
            return this._docData.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete'
        },
        /*
        {
          click: data => {
            this._router.navigate(['/project', data.project_id, 'doc', data.id, 'audits']);
          },
          menu: true,
          label: 'Audits'
        }
        */
      ],
      fetch: query => {

        query.project_id = this.project.id;
        query.categories = true;
        query.statuses = true;
        query.tags = true;
        query.modifier_accounts = true;
        query.types = true;

        return this._docData.gets(query, { key: null })
        .pipe(
          map(response => ({ data: response.docs, paging: response.paging }))
        );
      },
      restore: {
        query: { state: State.Deleted },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        filter: true,
        click: (row, event) => {
          return this._docData.put({ id: row.id, state: State.Active })
        }
      }
    };
  }

  public createDoc() {
    const dialogRef = this._dialog.open(DocCreateComponent, {
      data: { project_id: this.project.id }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response && response.id) {
        this._objectDrawerService.openObjectDrawer(this.project, response);
      }
    });

  }

  public openDocDrawer(row: Object) {
    this._objectDrawerService.openObjectDrawer(this.project, row);
  }

  private deleteDocs(selectedRows: Doc[] = []) {
    const docIds = fsList(selectedRows, 'id');

    return this._fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to delete selected docs?'
    })
      .pipe(
        takeUntil(this._destroy$),
        flatMap((response) => this._docData.bulkDelete(docIds)),
        map(() => true)
      )
  }

  private setTitle() {
    this._navService.setListTitleWithinEntity(
      'Docs',
      this.project.name,
      this.project.image.small
    );
  }
}
