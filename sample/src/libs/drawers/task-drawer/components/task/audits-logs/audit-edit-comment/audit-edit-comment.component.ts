import { Component, Inject, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuditData } from '@app/core';
import { AuditModel } from '@app/shared/models';

@Component({
  selector: 'audit-comment-edit',
  templateUrl: './audit-edit-comment.component.html',
  styleUrls: ['./audit-edit-comment.component.scss'],
})
export class AuditEditCommentComponent implements OnDestroy {
  public audit: AuditModel;
  public comment = null;

  private _destroy$ = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private _dialogRef: MatDialogRef<AuditEditCommentComponent>,
              private _auditData: AuditData) {

  }

  public ngOnInit() {
    this.audit = this.data.audit;
    this.comment = this.data.meta.object.meta.content;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public changed(value: any) {
    this.comment = value;
  }

  public save() {
    this._auditData.put({ id: this.audit.id, comment: this.comment })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._dialogRef.close(this.comment);
      })
  }

  public close() {
    this._dialogRef.close();
  }

}
