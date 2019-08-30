import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Object, Task } from 'app/shared/interfaces';
import { Doc } from '@libs/drawers/doc-drawer/interfaces'
import { RelateExistedObjectDialogComponent } from './existing-object-dialog/';
import { ObjectService, ObjectData } from 'app/core';
import { TaskCreateComponent } from '../../task-create';
import { DocCreateComponent } from '../../doc-create';


@Component({
  selector: 'app-related-object-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss']
})
export class RelatedObjectCreateMenuComponent implements OnDestroy {

  @Input() public entity: Doc | Task = null;
  @Input() public relates = [];
  @Output() public relatesChange = new EventEmitter<(Object)[]>();

  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,
    private _objectService: ObjectService,
    private _objectData: ObjectData
  ) { }

  public addExisted() {
    const dialogRef = this._dialog.open(RelateExistedObjectDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { entity: this.entity, relates: this.relates }
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.relates = response;
        this.relatesChange.emit(this.relates);
      }
    })
  }

  public addDoc() {
    const dialogRef = this._dialog.open(DocCreateComponent, {
      width: '600px',
      data: { project_id: this.entity.project_id }
    });

    dialogRef.afterClosed().subscribe((response: Object | null) => {
      if (response) {
        this._objectData.relate(this.entity.id, response.id)
          .pipe(
            takeUntil(this._destroy$)
          ).subscribe(() => {
            this.addEntity(response);
          });
      }
    })
  }

  public addTask() {
    const dialogRef = this._dialog.open(TaskCreateComponent, {
      width: '30%',
      minWidth: '400px',
      data: { project_id: this.entity.project_id }
    });

    dialogRef.afterClosed().subscribe((response: Object | null) => {
      if (response) {
        this._objectData.relate(this.entity.id, response.id)
          .pipe(
            takeUntil(this._destroy$)
          ).subscribe(() => {
            this.addEntity(response);
        });
      }
    })
  }

  public addEntity(object: Object) {
    if (!this.relates[object.class]) {
      this.relates[object.class] = [];
    }

    this.relates[object.class].push(object);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
